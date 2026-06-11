import type { Messages } from "./types";

export const zh: Messages = {
  listSep: "、",
  htmlLang: "zh-Hans",
  brandTag: "玲珑 · Claude Code",
  skipLink: "跳到技能目录",
  navAria: "章节导航",
  installTabsAria: "安装方式",
  nav: {
    overview: "概览",
    install: "安装",
    plugins: "插件",
    catalog: "目录",
    quality: "校验",
    github: "GitHub",
    menu: "菜单",
  },
  loading: "正在加载 catalog…",
  error: {
    loadFailed: "无法加载",
    devHint: "本地开发请运行 pnpm dev（会自动 export catalog）。",
  },
  hero: {
    lede:
      "本页是 linglong-marketplace 的完整介绍：浏览插件与 skill、复制安装命令，或一键安装到 Claude Code。",
    repoBtn: "GitHub 仓库",
    installBtn: "安装指南",
    copyCurlBtn: "复制 curl 安装",
  },
  meta: {
    repo: "仓库",
    branch: "分支",
    built: "构建",
    manifest: "Manifest",
    pages: "Pages",
  },
  overview: {
    title: "概览",
    highlight:
      "linglong-marketplace 是面向 Tauri、RFC 工作流与 macOS SwiftPM 的 Claude Code 插件市场。本站托管于",
    highlightSuffix: "；源码在",
    highlightEnd: "。",
    fastest: "最快安装（macOS / Linux，需 Claude CLI）：",
    pluginHint:
      "Claude Code 会话内也可用 /plugin 命令（Git HTTPS 源，不是 Pages URL）。详见下方「安装」。",
    catalogNote: "本页列出 marketplace",
    catalogNoteSuffix:
      " 中的全部 skill 与 plugin。数据来自 .claude-plugin/marketplace.json 与各 SKILL.md。",
    machineReadable: "机器可读：",
  },
  install: {
    title: "安装",
    tabs: {
      quick: "快速安装",
      ghPages: "GitHub Pages",
      marketplace: "Claude Code",
      clone: "Clone",
      copySkills: "~/.claude/skills",
    },
    quick: {
      note:
        "在 macOS / Linux 终端运行（需已安装 Claude Code CLI）。脚本会注册 {name} 并安装全部 plugin。",
      source: "源码仓库：",
      oneLiner: "一行命令（推荐）",
      copyCurl: "复制 curl 安装",
      viewScript: "查看 install.sh",
      localRun: "克隆后本地运行",
      copyCli: "复制 CLI 命令",
      copyPagesCurl: "复制 Pages 版 curl",
    },
    ghPages: {
      note:
        "linglong-marketplace 通过 GitHub Actions 部署到 GitHub Pages：推送 main 后自动构建本目录站。在此浏览 skill 列表；在 Claude Code 里用 Git 仓库注册 marketplace（不是 Pages URL）。",
      stepOpen: "打开 Pages 站点：",
      stepGit: "Git 仓库：",
      stepIndex: "机器可读索引：",
      stepRegister: "在 Claude Code 注册 marketplace（git 源）并安装 plugin：",
      copyClaude: "复制 Claude 安装命令",
      copyLinks: "复制 Pages 链接",
      manifest: "Marketplace manifest（git raw）：",
    },
    marketplace: {
      note: "将仓库添加为 marketplace，再按需安装 plugin。",
      gitSource: "Git 源：",
      manifest: "Manifest：",
      pluginsDir: "Plugin 包位于",
      copyPlugin: "复制 /plugin 命令",
      docs: "文档：",
    },
    clone: {
      note: "克隆仓库后，可将本地路径注册为 marketplace，或运行 sh install.sh。",
      copyHttps: "复制 HTTPS 克隆地址",
      copyOneLiner: "复制一行命令",
    },
    copySkills: {
      note: "不用 marketplace 时，可将 skill 目录复制到全局 Claude skills 目录。",
      copyCmd: "复制命令",
    },
  },
  plugins: {
    title: "插件",
    colPlugin: "插件",
    colDesc: "说明",
    colSkills: "Skills",
  },
  skills: {
    title: "Skill 目录",
    filter: "筛选",
    placeholder: "按名称、路径、描述搜索…",
    source: "源码",
  },
  quality: {
    title: "本地校验",
    note: "贡献者：推送前请运行与 Husky 相同的检查。",
    copy: "复制",
  },
  footer: {
    branch: "分支",
    backTop: "回顶部",
  },
  copy: {
    unavailable: "剪贴板不可用",
    success: "已复制",
    failed: "复制失败",
  },
  lang: {
    switchToZh: "中文",
    switchToEn: "English",
    label: "语言",
  },
};
