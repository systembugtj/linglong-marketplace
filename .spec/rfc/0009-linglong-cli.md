# RFC 0009: linglong CLI: search, add, outdated (child of 0006)

**Status:** Draft

**Parent:** [0006](0006-skill-index-marketplace.md)

## Summary

A small Node command, `linglong`, that searches the published index and installs a skill by calling `npx skills add` at the pinned commit. It adds search, a confirmation step, and an outdated check on top of the installer that already exists.

## Problem

`npx skills add <repo> --list` already discovers and installs skills, but nothing answers "which skills are ready to use" across the repositories listed in the marketplace. There is no way to see the pinned commit, the scan result, or whether an installed copy is behind the index.

## Goals

- Search the index by text.
- Install with the pinned commit and show what will be installed first.
- Report installed skills whose commit differs from the index, and installed skills that were revoked.

## Non-goals

- Reimplementing cloning, symlinking, or per-agent directory logic. `npx skills` owns those.
- A graphical interface.
- Hosting or caching skill content.

## Design

### Commands

| Command | Behavior |
|---------|----------|
| `linglong search <words>` | Fetch the published `catalog.json`, match on name, description, and tags, print name, repository, and description |
| `linglong list` | Print every entry |
| `linglong add <name> [--skill <skill>] [-a <agent>] [-g] [-y]` | Show repository, commit, and scan findings; ask to confirm unless `-y`; run `npx skills add "<repo>#<ref>"` with the remaining flags passed through |
| `linglong outdated` | Compare installed skills with the index and print behind or revoked entries |

### Rules

- The catalog is read from the GitHub Pages URL, which is deployed from `main` only, over HTTPS.
- The CLI refuses an entry whose `ref` is not a 40-character hash, and refuses entries marked `revoked`.
- The CLI never executes anything from a skill.
- Output when not on a terminal is plain, with `--json` for machines.

### Package

`packages/cli` in this repository, published as `@linglongjs/cli`, binary `linglong`, Node 22 or newer, no runtime dependencies. Usage without installing: `npx @linglongjs/cli search tauri`.

## Acceptance

1. `linglong search tauri` lists the entries whose text matches, from the published catalog.
2. `linglong add rfcify` prints the repository and commit, asks to confirm, and runs `npx skills add` at that commit.
3. An entry with a branch name in `ref`, or with `status: revoked`, is refused.
4. `linglong outdated` lists an installed skill whose commit differs from the index.

## Open questions

- How `outdated` learns the installed commit is unresolved. `npx skills` has a `list` command and a lock file marked experimental; their content must be checked before choosing.
- Whether the CLI can read the unpromoted `develop` catalog through a flag such as `--channel develop` is proposed but not decided.
