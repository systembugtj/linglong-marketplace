export const LOCALE_ZH = "zh" as const;
export const LOCALE_EN = "en" as const;

export type Locale = typeof LOCALE_ZH | typeof LOCALE_EN;

export type Messages = {
  listSep: string;
  htmlLang: string;
  brandTag: string;
  skipLink: string;
  navAria: string;
  installTabsAria: string;
  nav: {
    overview: string;
    install: string;
    plugins: string;
    catalog: string;
    quality: string;
    github: string;
    menu: string;
  };
  loading: string;
  error: {
    loadFailed: string;
    devHint: string;
  };
  hero: {
    lede: string;
    repoBtn: string;
    installBtn: string;
    copyCurlBtn: string;
  };
  meta: {
    repo: string;
    branch: string;
    built: string;
    manifest: string;
    pages: string;
  };
  overview: {
    title: string;
    highlight: string;
    highlightSuffix: string;
    fastest: string;
    pluginHint: string;
    catalogNote: string;
    catalogNoteSuffix: string;
    highlightEnd: string;
    machineReadable: string;
  };
  install: {
    title: string;
    tabs: {
      quick: string;
      ghPages: string;
      marketplace: string;
      clone: string;
      copySkills: string;
    };
    quick: {
      note: string;
      source: string;
      oneLiner: string;
      copyCurl: string;
      viewScript: string;
      localRun: string;
      copyCli: string;
      copyPagesCurl: string;
    };
    ghPages: {
      note: string;
      stepOpen: string;
      stepGit: string;
      stepIndex: string;
      stepRegister: string;
      copyClaude: string;
      copyLinks: string;
      manifest: string;
    };
    marketplace: {
      note: string;
      gitSource: string;
      manifest: string;
      pluginsDir: string;
      copyPlugin: string;
      docs: string;
    };
    clone: {
      note: string;
      copyHttps: string;
      copyOneLiner: string;
    };
    copySkills: {
      note: string;
      copyCmd: string;
    };
  };
  plugins: {
    title: string;
    colPlugin: string;
    colDesc: string;
    colSkills: string;
  };
  skills: {
    title: string;
    filter: string;
    placeholder: string;
    source: string;
  };
  quality: {
    title: string;
    note: string;
    copy: string;
  };
  footer: {
    branch: string;
    backTop: string;
  };
  copy: {
    unavailable: string;
    success: string;
    failed: string;
  };
  lang: {
    switchToZh: string;
    switchToEn: string;
    label: string;
  };
};
