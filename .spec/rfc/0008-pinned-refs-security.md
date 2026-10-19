# RFC 0008: Pinned refs and supply-chain security (child of 0006)

**Status:** Draft

**Parent:** [0006](0006-skill-index-marketplace.md)

## Summary

A skill is a set of instructions an agent follows with the user's privileges, and may bundle scripts. The index therefore pins every skill to a reviewed commit, binds it to a repository identity, never executes skill content in CI, scans it statically, and lets a maintainer revoke a version.

## Problem

Installing a skill from a branch or tag runs whatever the author pushed last. A repository can be renamed, transferred, or deleted and recreated by someone else. A commit from a fork can be fetched through the parent repository's URL. Hidden text in a `SKILL.md` can inject instructions. A CI job that runs untrusted code can leak secrets.

## Goals

- The installed bytes are exactly the bytes a maintainer reviewed.
- A hijacked or impersonated repository is detected.
- CI reads skill content but never runs it.
- A bad version can be withdrawn and users are warned.

## Non-goals

- Sandboxing skills at runtime on the user's machine.
- Defending against a compromised maintainer account.
- Verifying what a skill does semantically; the scan finds risky patterns and a maintainer judges them.

## Design

### Pinning

- `ref` is a full 40-character commit hash. Branch names and tags are rejected by CI and by the CLI.
- CI confirms the commit is reachable from the repository's default branch. This rejects commits that exist only in a fork.
- `npx skills add "<repo>#<ref>"` installs at that commit. This was tested against this repository: the tool cloned the given commit and listed its skills.

### Identity

- `repo_id` records the numeric GitHub id. If a repository is renamed, transferred, or recreated, the id differs and CI and the CLI report an error.
- The default allowed organization is `borg0ai`. Any other organization needs a stated reason in the pull request.

### CI isolation

- Workflows use `pull_request`, never `pull_request_target`.
- Permissions are `contents: read`. The pull request workflows have no secrets.
- Third-party actions are pinned to commit hashes.
- CI clones and reads files. It does not install dependencies or run skill scripts.

### Static scan

The scan runs on the pinned tree and, for a version bump, on the difference between the old and new commits. It reports:

- executable files and any `scripts/` directory;
- `curl | sh`, base64 decoding, and network calls in scripts;
- hooks and an over-broad `allowed-tools` value such as `Bash(*)`;
- symlinks that point outside the repository;
- hidden or bidirectional Unicode control characters in `SKILL.md`;
- large binary files.

Findings are posted on the pull request. The pull request template lists each finding and the maintainer must acknowledge every one before merge. The scan never approves a pull request by itself.

### Version bumps and revocation

- A scheduled job opens a bump pull request to `develop` when a skill repository has new commits. The pull request shows the difference and its scan. The bot cannot merge.
- Setting `status: revoked` on an entry marks a version as withdrawn. The CLI warns when a revoked commit is installed and refuses to install it.

## Acceptance

1. A branch name or tag in `ref` fails CI and is refused by the CLI.
2. A commit that is not on the default branch of the repository fails CI.
3. Changing `repo_id` to a different value, or pointing at a recreated repository, fails CI.
4. A `SKILL.md` containing a zero-width or bidirectional control character produces a scan finding.
5. The pull request workflows contain no `pull_request_target` trigger and no secrets.
6. A revoked entry is refused by `linglong add`.

## Open questions

- Whether scan findings should block merge or only require acknowledgement is proposed as acknowledgement and awaits the maintainer's decision.
- Whether `npx skills` sends install telemetry, and how to disable it, is not yet verified.
