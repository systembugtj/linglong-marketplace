# RFC 0006: Skill index marketplace redesign (Umbrella)

**Status:** Draft

**Type:** Umbrella

## Summary

Turn `linglong-marketplace` from a repository that contains skills into an index that points at them. Each skill lives in its own repository, named in the `<noun>ify` pattern under the `borg0ai` org. The marketplace only records where each skill is published and which reviewed commit to install. A `linglong` CLI searches that index and installs through `npx skills`. New skills enter by pull request to `develop`, and `develop` is promoted to `main` by a second pull request.

## Problem

The repository today holds plugin sources under `plugins/`, one `marketplace.json`, and a generated `catalog.json` that has already drifted from the tree (11 skills in the catalog, 12 in the repository). A skill cannot be versioned, reviewed, or revoked on its own. Anyone installing trusts whatever is on the default branch at that moment. There is no command to search what is ready to use.

## Goals

The umbrella may close when all four children are Approved or Implemented and the following hold:

1. The marketplace repository contains no skill sources, only index entries, the CLI, and CI.
2. Every previously hosted skill is published from its own `*ify` repository and listed in the index.
3. `linglong search` and `linglong add` work against the published index.
4. A new skill can only reach `main` through `develop`, with the checks in 0007 and 0008.

## Non-goals

- Hosting skill content in this repository.
- Accepting skills from arbitrary organizations by default.
- Replacing `npx skills` as the installer.
- A graphical skill manager.
- Rating, download counts, or any ranking beyond text match.

## Children

| RFC | Concern |
|-----|---------|
| [0010](0010-migrate-skills-to-ify-repos.md) | Migrate existing skills to *ify repos |
| [0009](0009-linglong-cli.md) | linglong CLI: search, add, outdated |
| [0008](0008-pinned-refs-security.md) | Pinned refs and supply-chain security |
| [0007](0007-folder-index-pr-gate.md) | Folder-based skill index and PR acceptance |

## Acceptance

The umbrella may close when listed children meet the Goals criteria above. It must not be reopened for new work; new concerns get a new child under a new umbrella.
