# Task tracking

Operational tasks linked to [RFCs](rfc/). Mark **Done** when merged to `main`.

## Active

- [ ] Implement RFC 0006: Skill index marketplace redesign (Umbrella) (RFC 0006)
  - [ ] Implement RFC 0007: Folder-based skill index and PR acceptance (child of 0006) (RFC 0007)
  - [ ] Implement RFC 0008: Pinned refs and supply-chain security (child of 0006) (RFC 0008)
  - [ ] Implement RFC 0009: linglong CLI: search, add, outdated (child of 0006) (RFC 0009)
  - [ ] Implement RFC 0010: Migrate existing skills to *ify repos (child of 0006) (RFC 0010)

## Done

- [x] Restructure plugins as `tauri-plugin`, `rfc-plugin`, `macos-swiftpm-plugin` (RFC 0002)
- [x] pnpm + Turbo monorepo; remove Python build scripts (RFC 0001)
- [x] Extract `@linglongjs/skill-validator` with `ll-skills` CLI (RFC 0001)
- [x] Add `@linglongjs/marketplace-build` with `ll-catalog` CLI (RFC 0001)
- [x] GitHub Pages site + `install.sh` curl flow (RFC 0003)
- [x] `.spec/rfc` tree with ROADMAP + TASK_TRACKING only (no README dupes)
- [x] Rename `tauri-plugin` to `tauri-dev-plugin` and add `tauri-dev-prod-isolation` skill (RFC 0004)
- [x] Add `tauri-theme-management` skill to `tauri-dev-plugin` (Photasa RFC 0159 — Vite `?raw` prod theme CSS)
- [x] Add `tauri-macos-help-menu` skill to `tauri-dev-plugin` (Photasa RFC 0170/0171 — muda 0.17.2 and runtime menu IPC evidence)
- [x] Add dual-compatible `velox-dev-plugin` with CLI-first macOS bundle diagnostics (RFC 0005)

## To do

- [ ] Publish `@linglongjs/skill-validator` to npm
- [ ] CI badge / link on GitHub Pages after deploy
