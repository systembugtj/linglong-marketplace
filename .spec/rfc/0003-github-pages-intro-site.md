# RFC 0003: GitHub Pages intro site and install flow

**Status:** Implemented  
**Created:** 2026-06-11

## Summary

Self-contained **GitHub Pages** site for browsing plugins/skills, with README ↔ git ↔ Pages cross-links and a **`curl | sh`** installer for macOS/Linux.

## Motivation

- New users need one URL to understand and install the marketplace.
- Claude Code registers marketplaces via **git HTTPS**, not Pages URL — the site must explain both.
- Common install pattern: `curl -fsSL …/install.sh | sh`.

## Proposal

| Artifact | Role |
|----------|------|
| `site/` | Vite + React; builds to `site/dist` |
| `ll-catalog` | Writes `site/public/catalog.json` before build |
| `install.sh` | `claude plugin marketplace add` + install all plugins |
| `.github/workflows/deploy-pages.yml` | `pnpm build --filter @linglongjs/site` |

URLs:

- Pages: `https://systembugtj.github.io/linglong-marketplace/`
- Git: `https://github.com/systembugtj/linglong-marketplace`

## Implementation notes

- `catalog.json` is generated; gitignored under `site/public/` except `.gitkeep` / `.nojekyll`.
- `install.sh` copied to `site/public/` on catalog export for Pages-hosted curl fallback.
