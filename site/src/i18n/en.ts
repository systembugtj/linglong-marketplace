import type { Messages } from "./types";

export const en: Messages = {
  listSep: ", ",
  htmlLang: "en",
  brandTag: "Linglong · Claude Code",
  skipLink: "Skip to skill catalog",
  navAria: "Section navigation",
  installTabsAria: "Install methods",
  nav: {
    overview: "Overview",
    install: "Install",
    plugins: "Plugins",
    catalog: "Catalog",
    quality: "Validate",
    github: "GitHub",
    menu: "Menu",
  },
  loading: "Loading catalog…",
  error: {
    loadFailed: "Failed to load",
    devHint: "For local dev, run pnpm dev (exports catalog automatically).",
  },
  hero: {
    lede:
      "Full intro to linglong-marketplace: browse plugins and skills, copy install commands, or one-shot install into Claude Code.",
    repoBtn: "GitHub repo",
    installBtn: "Install guide",
    copyCurlBtn: "Copy curl install",
  },
  meta: {
    repo: "Repo",
    branch: "Branch",
    built: "Built",
    manifest: "Manifest",
    pages: "Pages",
  },
  overview: {
    title: "Overview",
    highlight:
      "linglong-marketplace is a Claude Code plugin marketplace for Tauri, RFC workflows, and macOS SwiftPM. Hosted on",
    highlightSuffix: "; source on",
    highlightEnd: ".",
    fastest: "Fastest install (macOS / Linux, Claude CLI required):",
    pluginHint:
      "Inside Claude Code you can also use /plugin commands (Git HTTPS source, not the Pages URL). See Install below.",
    catalogNote:
      "This page lists every skill and plugin in marketplace",
    catalogNoteSuffix:
      ", generated from .claude-plugin/marketplace.json and each SKILL.md.",
    machineReadable: "Machine-readable:",
  },
  install: {
    title: "Install",
    tabs: {
      quick: "Quick install",
      ghPages: "GitHub Pages",
      marketplace: "Claude Code",
      clone: "Clone",
      copySkills: "~/.claude/skills",
    },
    quick: {
      note:
        "Run in a macOS / Linux terminal (Claude Code CLI required). The script registers {name} and installs all plugins.",
      source: "Source repo:",
      oneLiner: "One-liner (recommended)",
      copyCurl: "Copy curl install",
      viewScript: "View install.sh",
      localRun: "Clone then run locally",
      copyCli: "Copy CLI commands",
      copyPagesCurl: "Copy Pages curl",
    },
    ghPages: {
      note:
        "linglong-marketplace deploys to GitHub Pages via GitHub Actions: push to main to rebuild this site. Browse skills here; register the marketplace in Claude Code with the Git repo (not the Pages URL).",
      stepOpen: "Open the Pages site:",
      stepGit: "Git repository:",
      stepIndex: "Machine-readable index:",
      stepRegister: "Register marketplace in Claude Code (git source) and install plugins:",
      copyClaude: "Copy Claude install commands",
      copyLinks: "Copy Pages links",
      manifest: "Marketplace manifest (git raw):",
    },
    marketplace: {
      note: "Add the repo as a marketplace, then install plugins as needed.",
      gitSource: "Git source:",
      manifest: "Manifest:",
      pluginsDir: "Plugin packages live under",
      copyPlugin: "Copy /plugin commands",
      docs: "Docs:",
    },
    clone: {
      note:
        "After cloning, register a local path as a marketplace or run sh install.sh.",
      copyHttps: "Copy HTTPS clone URL",
      copyOneLiner: "Copy one-liner",
    },
    copySkills: {
      note:
        "Without a marketplace, copy skill folders into your global Claude skills directory.",
      copyCmd: "Copy command",
    },
  },
  plugins: {
    title: "Plugins",
    colPlugin: "Plugin",
    colDesc: "Description",
    colSkills: "Skills",
  },
  skills: {
    title: "Skill catalog",
    filter: "Filter",
    placeholder: "Search by name, path, or description…",
    source: "Source",
  },
  quality: {
    title: "Local validation",
    note: "Contributors: run the same checks as Husky before pushing.",
    copy: "Copy",
  },
  footer: {
    branch: "branch",
    backTop: "Back to top",
  },
  copy: {
    unavailable: "Clipboard unavailable",
    success: "Copied",
    failed: "Copy failed",
  },
  lang: {
    switchToZh: "中文",
    switchToEn: "English",
    label: "Language",
  },
};
