# RFC 0002: Standard Claude Code plugin marketplace

**Status:** Implemented  
**Created:** 2026-06-11

## Summary

Adopt the official Claude Code **plugin marketplace** layout: `marketplace.json` at repo root, domain-scoped plugins under `plugins/<name>/`, each with `.claude-plugin/plugin.json` and `skills/<skill>/SKILL.md`.

## Motivation

- Remove `.skill` zip bundles and non-standard layouts.
- Name plugins by domain (`tauri-plugin`, `rfc-plugin`, …), not `linglong-skills`.
- Enable `claude plugin marketplace add <git-url>` and per-plugin install.

## Proposal

```
.claude-plugin/marketplace.json
plugins/
  tauri-plugin/.claude-plugin/plugin.json + skills/tauri-project/
  rfc-plugin/…
  macos-swiftpm-plugin/…
```

Marketplace name: `linglong-marketplace`.

Validation: `ll-skills` (strict plugin manifests, SKILL frontmatter, no orphan skills).

## Implementation notes

- `strict: true` on marketplace plugin entries.
- Husky runs `pnpm check` on commit/push.
