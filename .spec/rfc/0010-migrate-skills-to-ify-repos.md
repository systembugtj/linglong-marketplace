# RFC 0010: Migrate existing skills to *ify repos (child of 0006)

**Status:** Draft

**Parent:** [0006](0006-skill-index-marketplace.md)

## Summary

Move every skill now stored under `plugins/` into its own repository under the `borg0ai` org, named `<noun>ify`, keeping history. Register each new repository in the index through the pull request flow in 0007, then remove the sources from this repository.

## Problem

All current skills are tied to this repository's history and release cycle. The index design in 0006 requires them to be independently published, reviewed, and pinned.

## Goals

- Each existing skill is installable from its own repository at a pinned commit.
- History of each skill is preserved in its new repository.
- This repository ends with no skill sources.

## Non-goals

- Rewriting skill content. The only edits allowed are those needed to make the skill valid on its own.
- Deciding the final names of skills that are not yet mapped.

## Design

### Proposed mapping

These names are proposals, not decisions.

| New repository | Skills it takes |
|----------------|------------------|
| `rfcify` | `rfc-management`, `rfc-workflow` |
| `tauriify` | `tauri-project`, `tauri-dev-prod-isolation`, `tauri-theme-management`, `tauri-macos-keyboard`, `tauri-macos-help-menu` |
| `pagesify` | `vite-github-pages` |
| `veloxify` | `velox-development` |
| to decide | `macos-swiftpm-cli-app`, `macos-swiftpm-app-deployer` |
| to decide | `tauri-github-release-workflow`, which may overlap the existing `shipify` |

### Steps

1. Commit or set aside the uncommitted work in this repository (a modified `tauri-dev-plugin` manifest and the untracked `tauri-github-release-workflow` skill) so it is not lost.
2. For each repository, extract the paths with their history, for example with `git filter-repo --path`, into a new working copy.
3. Create the repository under `borg0ai`. This is an action outside this machine and needs the maintainer's go-ahead for each repository.
4. Push, then open one pull request to `develop` that adds `skills/<name>/skill.yaml` with the pinned commit.
5. After the whole set is on `main`, remove `plugins/` and update `README.md`.

### Compatibility

The current `/plugin marketplace add` flow and `.claude-plugin/marketplace.json` keep working until step 5. Removing them breaks anyone who installed `tauri-dev-plugin@linglong-marketplace`. Whether to keep a read-only compatibility manifest is an open question.

## Acceptance

1. Each mapped skill installs with `linglong add <name>` from its own repository.
2. `git log` in each new repository shows the history of its skills.
3. After step 5 the `plugins/` directory is gone and `linglong list` shows every migrated entry.

## Open questions

- Names and grouping of the unmapped skills.
- Whether the Claude Code plugin marketplace manifest stays as a compatibility layer.
- The count of skills differs between the catalog (11) and the repository (12) because the catalog is stale; migration uses the repository tree.
