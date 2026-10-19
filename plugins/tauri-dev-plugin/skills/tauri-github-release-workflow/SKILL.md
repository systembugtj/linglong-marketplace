---
name: tauri-github-release-workflow
description: Use this skill when designing or debugging a GitHub Actions release pipeline for a Tauri v2 app that ships signed, multi-platform binaries — release-please version bumping, tag-to-commit-SHA handoff between workflows, reusable workflow_call + workflow_dispatch dual-trigger design, per-OS build matrices with tauri-action, and post-build verification that release assets (especially the updater's latest.json) actually landed. Distilled from a production release.yml/upload-release-assets.yml pair. Also use when a release workflow "succeeds" but produces a broken or incomplete release.
---

# Tauri GitHub release workflow design

Distilled from a real production Tauri v2 release pipeline (release-please + tauri-action multi-platform builds). The design choices below solve specific failure modes that were hit in practice — treat the "why" as load-bearing, not decoration.

## Core shape: two workflows, one handoff

Split into **two files**, connected by `workflow_call`:

1. **Trigger workflow** (`release.yml`) — runs `release-please-action` on push to main. Its only job is version bumping + changelog + creating the GitHub Release. It does **not** build anything.
2. **Build/upload workflow** (`upload-release-assets.yml`) — a `workflow_call` reusable workflow, invoked by (1) only `if: needs.release-please.outputs.release_created == 'true'`. Builds per-OS via `tauri-apps/tauri-action`, uploads to the release already created in step 1.

```yaml
# release.yml
jobs:
  release-please:
    outputs:
      release_created: ${{ steps.release.outputs.release_created }}
      tag_name: ${{ steps.release.outputs.tag_name }}
      sha: ${{ steps.release.outputs.sha }}
    steps:
      - uses: googleapis/release-please-action@v4
        id: release

  upload-release-assets:
    needs: release-please
    if: ${{ needs.release-please.outputs.release_created == 'true' }}
    uses: ./.github/workflows/upload-release-assets.yml
    with:
      tag_name: ${{ needs.release-please.outputs.tag_name }}
      release_sha: ${{ needs.release-please.outputs.sha }}
    secrets: inherit
```

**Why split**: the build workflow needs `workflow_dispatch` too (manual retry of a failed platform leg without cutting a new release), and reusable `workflow_call` + `workflow_dispatch` on the same file is the standard way to get both "automatic after release" and "manual retry" from one implementation, not two copies.

## Explicit tag + SHA, never "guess the latest tag"

Pass `tag_name` and `release_sha` as **explicit inputs** through the whole chain — never let the build job re-derive "the latest tag" or "the current ref" on its own. release-please's own output is the source of truth for which commit got tagged; guessing via `git describe` or `github.sha` at build time can drift if pushes land between the release job and the build job starting.

```yaml
on:
  workflow_call:
    inputs:
      tag_name: { required: true, type: string }
      release_sha: { required: true, type: string }
  workflow_dispatch:
    inputs:
      tag_name: { required: true, type: string }
      release_sha: { required: false, type: string }  # resolved from tag ref if empty
```

Inside the job, branch on `github.event_name` to pick which input source applies — a reusable workflow invoked via `workflow_call` still reports the **caller's** trigger as `github.event_name` (e.g. `push`), not `workflow_call`. Don't gate logic on `github.event_name == 'workflow_call'`; it will never match.

## Fail fast on missing signing secrets, before the matrix fans out

`tauri-action` needs `TAURI_SIGNING_PRIVATE_KEY` (and its password) for updater signing. Verify the secret is non-empty in a **cheap early step**, before the expensive per-OS matrix jobs start:

```yaml
- name: Verify signing key secret presence
  run: |
    if [ -z "${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}" ]; then
      echo "::error::TAURI_SIGNING_PRIVATE_KEY is missing. Fail-fast to prevent unsigned releases."
      exit 1
    fi
```

Without this, a missing secret surfaces as a cryptic failure deep in one matrix leg (or worse, a silent unsigned build) after burning 10+ minutes of parallel CI across every OS.

## Matrix OS list as a computed output, not hardcoded

Resolve the platform list in its own job step, output as JSON, consume via `fromJSON` in the matrix. This makes "temporarily disable Windows" (or any platform) a one-line env flag change instead of editing the matrix array in multiple places:

```yaml
resolve:
  outputs:
    matrix: ${{ steps.platforms.outputs.matrix }}
  steps:
    - id: platforms
      run: |
        platforms='["ubuntu-latest","macos-latest"]'
        if [ "${{ env.WINDOWS_ENABLED }}" = "true" ]; then
          platforms='["ubuntu-latest","macos-latest","windows-latest"]'
        fi
        echo "matrix=$platforms" >> "$GITHUB_OUTPUT"

build:
  needs: resolve
  strategy:
    fail-fast: false  # one platform's failure shouldn't cancel the others mid-upload
    matrix:
      os: ${{ fromJSON(needs.resolve.outputs.matrix) }}
  steps:
    - uses: tauri-apps/tauri-action@v0
      env:
        TAURI_SIGNING_PRIVATE_KEY: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}
        TAURI_SIGNING_PRIVATE_KEY_PASSWORD: ${{ secrets.TAURI_SIGNING_PRIVATE_KEY_PASSWORD }}
      with:
        tagName: ${{ needs.resolve.outputs.tag_name }}
        releaseCommitish: ${{ needs.resolve.outputs.release_sha }}
        args: ${{ runner.os == 'Linux' && '--bundles appimage,deb,rpm' || runner.os == 'macOS' && '--bundles app,dmg' || '' }}
```

`fail-fast: false` matters specifically for release uploads: if macOS fails after Linux already uploaded its asset, you want the Linux asset to stay published, not get cancelled retroactively.

## Verify the release is actually complete — after the matrix, not per-leg

A build matrix reporting all-green does **not** mean the release is updater-ready. `bundle.createUpdaterArtifacts` can be silently `false`/misconfigured in `tauri.conf.json` — the build succeeds, installers upload fine, CI is green, but no signed `latest.json` is produced. The updater then 404s in production while every dashboard says the release shipped clean.

Add a final verification job that runs once, after every platform leg, and opens the actual `latest.json` content — not just checks that job exit codes were 0 or that the file exists in the asset list:

```yaml
verify-updater-artifact:
  needs: [resolve, build-and-upload]
  if: ${{ always() && needs.build-and-upload.result != 'cancelled' }}
  steps:
    - run: |
        if [ "${{ needs.build-and-upload.result }}" != "success" ]; then
          echo "::error::not all platform legs succeeded"; exit 1
        fi
        gh release view "$tag" --json assets --jq '.assets[].name' | grep -qx "latest.json" || {
          echo "::error::latest.json missing — updater will be unreachable"; exit 1;
        }
        tmpdir="$(mktemp -d)"
        gh release download "$tag" --pattern "latest.json" --dir "$tmpdir"
        for platform in darwin-aarch64 linux-x86_64; do
          jq -e --arg p "$platform" \
            '.platforms[$p] | type == "object" and (.url|type=="string" and length>0) and (.signature|type=="string" and length>0)' \
            "$tmpdir/latest.json" >/dev/null || {
              echo "::error::latest.json missing updater entry for $platform"; exit 1;
            }
        done
```

A present-but-empty or malformed manifest is worse than a missing one, because it looks like success in the plain asset-name check.

**Run this check once, not once-per-matrix-leg** — checking after all legs finish avoids race conditions where you inspect the release's asset list while another leg is still mid-upload.

## Windows FFmpeg / native-lib setup

If the app bundles FFmpeg or another native lib needing MSVC toolchain setup on Windows, gate that setup step with a **job-level** `if: runner.os == 'Windows'`, not an `if` buried inside a composite action. A workflow-level `if` skips the action download entirely on Linux/macOS; an inner composite-action `if` still downloads the action on every OS and then no-ops, wasting time on every non-Windows leg.

Keep a single `env:` flag (e.g. `WINDOWS_ENABLED: "false"`) at the top of the file to toggle an entire platform on/off across both PR-build and release workflows — search-and-replace across multiple scattered `if:` conditions is how platforms silently get half-enabled.

## Checklist when reviewing a Tauri release workflow PR

1. Does the build job receive `tag_name`/`sha` as explicit inputs, or does it re-derive them?
2. Is there a `TAURI_SIGNING_PRIVATE_KEY` presence check before the matrix fans out?
3. Is `fail-fast: false` set on the build matrix, and is that intentional (it usually should be for uploads)?
4. Is `bundle.createUpdaterArtifacts` actually `true` in `tauri.conf.json` for the channels that ship an updater?
5. Is there a post-matrix verification step that opens `latest.json` and checks per-platform `url`/`signature` fields, not just that the file exists in the asset list?
