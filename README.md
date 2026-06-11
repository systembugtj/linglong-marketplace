# Linglong marketplace

Standard **Claude Code plugin marketplace** (`linglong-marketplace`) with domain-scoped plugins:

| Plugin | Skills |
|--------|--------|
| `tauri-plugin` | `tauri-project` |
| `rfc-plugin` | `rfc-management`, `rfc-workflow` |
| `macos-swiftpm-plugin` | `macos-swiftpm-cli-app`, `macos-swiftpm-app-deployer` |

**pnpm + Turbo monorepo** — no Python for build/validate.

| Package | Role |
|---------|------|
| `@linglongjs/marketplace` | TypeScript: validate manifest, export `catalog.json` |
| `@linglongjs/site` | Vite + React → **`site/dist`** for GitHub Pages |

## Browse & install

**Site (self-contained intro):** [Browse on GitHub Pages](https://systembugtj.github.io/linglong-marketplace/)

**Source:** [github.com/systembugtj/linglong-marketplace](https://github.com/systembugtj/linglong-marketplace)

**Quick install** (macOS / Linux, requires [Claude Code CLI](https://code.claude.com/docs/en/cli)):

```bash
curl -fsSL https://raw.githubusercontent.com/systembugtj/linglong-marketplace/main/install.sh | sh
```

Or after clone:

```bash
git clone https://github.com/systembugtj/linglong-marketplace.git
cd linglong-marketplace
sh install.sh
```

**In Claude Code** (Git HTTPS, not Pages URL):

```text
/plugin marketplace add https://github.com/systembugtj/linglong-marketplace.git
/plugin install tauri-plugin@linglong-marketplace
/plugin install rfc-plugin@linglong-marketplace
/plugin install macos-swiftpm-plugin@linglong-marketplace
```

## GitHub Pages

Push to `main` → [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) runs `pnpm build --filter @linglongjs/site` and publishes **`site/dist`**.

## Layout

```
.claude-plugin/marketplace.json
install.sh                # curl | sh installer (copied to site on build)
packages/marketplace/       # TS validate + catalog export
site/                       # Vite app → dist/
plugins/
  tauri-plugin/.claude-plugin/plugin.json + skills/…
  rfc-plugin/…
  macos-swiftpm-plugin/…
```

## Development

```bash
corepack enable
pnpm install
pnpm dev          # export catalog + Vite dev server
pnpm check        # turbo: validate + test (all packages)
pnpm build        # site → site/dist
```

Catalog URLs resolve from `git remote origin` locally; CI sets `GITHUB_REPOSITORY` / `GITHUB_REF_NAME`.

## Settings

**Settings → Pages → Source:** GitHub Actions (once per repo).
