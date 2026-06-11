# RFC 0001: @linglongjs packages toolchain

**Status:** Implemented  
**Created:** 2026-06-11

## Summary

`packages/` hosts **@linglongjs** CLIs and libraries for building Claude Code marketplaces. Plugin content stays in `plugins/`; the site app stays in `site/`.

## Motivation

- One place to validate skills and export catalog data for browse sites.
- Publishable tooling (`ll-skills`) separate from this repo’s GitHub Pages app.
- Replace ad-hoc Python scripts with TypeScript, tests, and Husky gates.

## Proposal

| Package | CLI | Role |
|---------|-----|------|
| `@linglongjs/skill-validator` | `ll-skills` | Validate `SKILL.md` + `marketplace.json` |
| `@linglongjs/marketplace-build` | `ll-catalog` | Export `catalog.json` / `manifest.json` |
| `@linglongjs/site` | — | Vite intro site (this repo only) |

Root scripts:

```bash
pnpm skills    # ll-skills
pnpm catalog   # ll-catalog
pnpm check     # turbo validate + test
```

`ll-skills` and `ll-catalog` auto-detect the marketplace root by walking up to `.claude-plugin/marketplace.json`.

## Implementation notes

- `packages/skill-validator` builds to `dist/`; public npm `publishConfig.access: public`.
- `packages/marketplace` is npm name `@linglongjs/marketplace-build` (folder `packages/marketplace`).
- Turbo: `validate` depends on `^build` for skill-validator.

## Alternatives considered

- Single `@linglongjs/marketplace` package — rejected; validation is reusable without catalog/site coupling.
- Keep Python validators — rejected; monorepo is pnpm-only.
