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
    catalogNote: "This page lists every skill and plugin in marketplace",
    catalogNoteSuffix:
      ", generated from .claude-plugin/marketplace.json and each SKILL.md.",
    machineReadable: "Machine-readable:",
  },
  install: {
    title: "Install",
    tabs: {
      quick: "curl / install.sh",
      plugin: "/plugin commands",
      copySkills: "~/.claude/skills",
    },
    quick: {
      note:
        "Standard plugin marketplace install: the script runs claude plugin marketplace add with the Git repo URL, then claude plugin install <plugin>@{name} for each plugin. Requires the Claude Code CLI.",
      curlHead: "One-liner (recommended)",
      copyCurl: "Copy curl install",
      viewScript: "View install.sh",
      cloneHead: "Clone then run install.sh",
      cloneNote:
        "Same as curl: install.sh registers the remote Git marketplace and installs all plugins. Do not point marketplace add at a local clone path.",
      cliHead: "Equivalent CLI (what install.sh runs)",
      copyCli: "Copy CLI commands",
    },
    plugin: {
      note:
        "Paste these inside a Claude Code session. Use the Git HTTPS repo URL (same as install.sh)—not the Pages URL and not a local clone path.",
      gitSource: "Git source:",
      stepAdd: "Register marketplace (remote Git repo)",
      stepInstall: "Install plugins (install only the ones you need)",
      copySlash: "Copy /plugin commands",
      docs: "Docs:",
    },
    copySkills: {
      note:
        "Advanced: without the plugin marketplace, copy skill folders into ~/.claude/skills (no plugin metadata or update flow).",
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
