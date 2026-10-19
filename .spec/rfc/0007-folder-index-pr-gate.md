# RFC 0007: Folder-based skill index and PR acceptance (child of 0006)

**Status:** Draft

**Parent:** [0006](0006-skill-index-marketplace.md)

## Summary

The index is a directory tree, one folder per skill repository, not a single file. A pull request adds one folder. Pull requests target `develop`; only a promotion pull request from `develop` may target `main`. A generated `catalog.json` is built from the folders in CI and published from `main`.

## Problem

A single index file makes unrelated pull requests touch the same lines and conflict. It also gives no clean unit to review, to remove, or to assign an owner to. Without branch rules, a pull request straight to `main` would publish a skill with one review.

## Goals

- One folder per skill repository, so adding or removing a skill is adding or deleting one folder.
- A fixed, machine-checkable shape so CI can accept or reject a pull request without human judgment on format.
- Two review points: acceptance into `develop`, and promotion to `main`.
- `catalog.json` is a build artifact, never committed.

## Non-goals

- Hosting skill content (it stays in the skill's own repository).
- Security scanning rules and ref pinning (0008).
- The CLI that reads the catalog (0009).

## Design

### Layout

```
skills/
  rfcify/
    skill.yaml
  tauriify/
    skill.yaml
```

The folder name equals the `name` field and the repository name, and must match `^[a-z]+ify$`.

### skill.yaml

| Field | Meaning |
|-------|---------|
| `name` | Same as the folder name |
| `repo` | `org/repo` of a public GitHub repository |
| `repo_id` | Numeric GitHub repository id (see 0008) |
| `ref` | Full 40-character commit hash that was reviewed (see 0008) |
| `description` | One sentence, at most 200 characters |
| `tags` | Short list of lowercase words |
| `status` | Optional; `revoked` marks a withdrawn version |

### Branches

- `develop` is created from `main`. Both are protected: pull request required, no direct push, no force push, code-owner review required.
- A new skill, a version bump, or a removal is a pull request to `develop`.
- Promotion is one pull request from `develop` to `main`. A required check named `branch-guard` fails any pull request to `main` whose head branch is not `develop`, or whose head repository is a fork. GitHub branch rules cannot express this restriction alone, so the check and the protection work together.
- `CODEOWNERS` covers `skills/**` and `.github/**`. Covering `.github/**` stops a pull request from editing the workflow that guards it.

### Checks on a pull request to `develop`

1. Only one new folder under `skills/`, and no other path changed.
2. `skill.yaml` matches the schema. The name is unique and is not within edit distance 2 of an existing name.
3. The repository is public, has a license, and `repo_id` matches.
4. `ll-skills` validates every `SKILL.md` in the repository at `ref`.
5. `npx skills add <repo>#<ref> --list` discovers at least one skill.

### Checks on the promotion pull request

All of the above again, over the whole difference between `develop` and `main`, plus the scan in 0008.

### Publishing

GitHub Pages deploys from `main` only. The workflow runs `ll-catalog` over `skills/*/skill.yaml` and publishes `catalog.json`. Removing a skill is deleting its folder through the same two pull requests.

## Acceptance

1. A pull request to `main` from any branch other than `develop` fails `branch-guard`.
2. A pull request to `develop` that adds one valid folder passes; one that changes two folders, or any file outside `skills/<name>/`, fails.
3. After promotion, the published `catalog.json` contains exactly the folders on `main`.
4. `catalog.json` is absent from version control.

## Open questions

- Whether skills reviewed on `develop` but not yet promoted should be installable for testing is unresolved; see 0009.
