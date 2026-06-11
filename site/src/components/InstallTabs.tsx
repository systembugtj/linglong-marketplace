import { useCallback, useState, type KeyboardEvent } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { LOCALE_ZH } from "../i18n/types";
import { CLAUDE_PLUGINS_DOCS_URL } from "../lib/constants";
import {
  buildClaudeInstallCommands,
  buildCliInstallCommands,
  buildCurlInstallCommand,
  buildCurlInstallFromPages,
  buildGhPagesBrowseLines,
} from "../lib/installCommands";
import type { SiteCatalog, Skill } from "../types/catalog";

const TAB_QUICK = "quick";
const TAB_GH_PAGES = "gh-pages";
const TAB_MARKETPLACE = "marketplace";
const TAB_CLONE = "clone";
const TAB_COPY = "copy";

type TabId =
  | typeof TAB_QUICK
  | typeof TAB_GH_PAGES
  | typeof TAB_MARKETPLACE
  | typeof TAB_CLONE
  | typeof TAB_COPY;

type Props = {
  catalog: SiteCatalog;
  onCopy: (text: string) => void;
};

function tabIdRole(
  id: TabId,
  active: TabId,
): { selected: boolean; tabIndex: number } {
  return {
    selected: active === id,
    tabIndex: active === id ? 0 : -1,
  };
}

export function InstallTabs({ catalog, onCopy }: Props) {
  const { locale, messages: t } = useLocale();
  const [active, setActive] = useState<TabId>(TAB_QUICK);

  const select = useCallback((id: TabId) => {
    setActive(id);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent, tabs: TabId[], index: number) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const nextIndex =
        e.key === "ArrowRight"
          ? Math.min(tabs.length - 1, index + 1)
          : Math.max(0, index - 1);
      const nextId = tabs[nextIndex];
      if (nextId) select(nextId);
    },
    [select],
  );

  const tabs: TabId[] = [
    TAB_QUICK,
    TAB_GH_PAGES,
    TAB_MARKETPLACE,
    TAB_CLONE,
    TAB_COPY,
  ];

  const curlCmd = buildCurlInstallCommand(catalog);
  const curlPagesCmd = buildCurlInstallFromPages(catalog);
  const installCmd = buildClaudeInstallCommands(catalog);
  const cliCmd = buildCliInstallCommands(catalog);
  const browseLines = buildGhPagesBrowseLines(catalog).join("\n");
  const cloneBlock = `git clone ${catalog.cloneUrl}\ncd ${catalog.repoName}`;
  const cloneOneLiner = `git clone ${catalog.cloneUrl} && cd ${catalog.repoName}`;
  const pluginList = catalog.plugins.map((p) => p.name).join(t.listSep);

  const q = tabIdRole(TAB_QUICK, active);
  const gp = tabIdRole(TAB_GH_PAGES, active);
  const m = tabIdRole(TAB_MARKETPLACE, active);
  const c = tabIdRole(TAB_CLONE, active);
  const cp = tabIdRole(TAB_COPY, active);

  return (
    <div className="install-tabs">
      <ul className="tablist" role="tablist" aria-label={t.installTabsAria}>
        <li role="presentation">
          <button
            type="button"
            role="tab"
            id="tab-quick"
            aria-controls="panel-quick"
            aria-selected={q.selected}
            tabIndex={q.tabIndex}
            onClick={() => select(TAB_QUICK)}
            onKeyDown={(e) => onKeyDown(e, tabs, 0)}
          >
            {t.install.tabs.quick}
          </button>
        </li>
        <li role="presentation">
          <button
            type="button"
            role="tab"
            id="tab-gh-pages"
            aria-controls="panel-gh-pages"
            aria-selected={gp.selected}
            tabIndex={gp.tabIndex}
            onClick={() => select(TAB_GH_PAGES)}
            onKeyDown={(e) => onKeyDown(e, tabs, 1)}
          >
            {t.install.tabs.ghPages}
          </button>
        </li>
        <li role="presentation">
          <button
            type="button"
            role="tab"
            id="tab-marketplace"
            aria-controls="panel-marketplace"
            aria-selected={m.selected}
            tabIndex={m.tabIndex}
            onClick={() => select(TAB_MARKETPLACE)}
            onKeyDown={(e) => onKeyDown(e, tabs, 2)}
          >
            {t.install.tabs.marketplace}
          </button>
        </li>
        <li role="presentation">
          <button
            type="button"
            role="tab"
            id="tab-clone"
            aria-controls="panel-clone"
            aria-selected={c.selected}
            tabIndex={c.tabIndex}
            onClick={() => select(TAB_CLONE)}
            onKeyDown={(e) => onKeyDown(e, tabs, 3)}
          >
            {t.install.tabs.clone}
          </button>
        </li>
        <li role="presentation">
          <button
            type="button"
            role="tab"
            id="tab-copy"
            aria-controls="panel-copy"
            aria-selected={cp.selected}
            tabIndex={cp.tabIndex}
            onClick={() => select(TAB_COPY)}
            onKeyDown={(e) => onKeyDown(e, tabs, 4)}
          >
            {t.install.tabs.copySkills}
          </button>
        </li>
      </ul>

      <div
        role="tabpanel"
        id="panel-quick"
        className={`tabpanel${active === TAB_QUICK ? " is-active" : ""}`}
        hidden={active !== TAB_QUICK}
      >
        <p className="note">
          {t.install.quick.note.replace("{name}", catalog.marketplaceName)}{" "}
          <a
            href="https://code.claude.com/docs/en/cli"
            target="_blank"
            rel="noopener noreferrer"
          >
            Claude Code CLI
          </a>
        </p>
        <p className="note tight">
          {t.install.quick.source}{" "}
          <a href={catalog.repositoryUrl}>{catalog.repositoryUrl}</a>
        </p>
        <h3 className="subhead">{t.install.quick.oneLiner}</h3>
        <pre className="code-block">{curlCmd}</pre>
        <div className="copy-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onCopy(curlCmd)}
          >
            {t.install.quick.copyCurl}
          </button>
          <a
            className="btn btn-ghost"
            href={catalog.installScriptRawUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.install.quick.viewScript}
          </a>
        </div>
        <h3 className="subhead">{t.install.quick.localRun}</h3>
        <pre className="code-block">{`git clone ${catalog.cloneUrl}\ncd ${catalog.repoName}\nsh install.sh`}</pre>
        <div className="copy-row">
          <button type="button" className="btn" onClick={() => onCopy(cliCmd)}>
            {t.install.quick.copyCli}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onCopy(curlPagesCmd)}
          >
            {t.install.quick.copyPagesCurl}
          </button>
        </div>
      </div>

      <div
        role="tabpanel"
        id="panel-gh-pages"
        className={`tabpanel${active === TAB_GH_PAGES ? " is-active" : ""}`}
        hidden={active !== TAB_GH_PAGES}
      >
        <p className="note">{t.install.ghPages.note}</p>
        <ol className="install-steps">
          <li>
            {t.install.ghPages.stepOpen}{" "}
            <a href={catalog.pagesUrl}>{catalog.pagesUrl}</a>
          </li>
          <li>
            {t.install.ghPages.stepGit}{" "}
            <a href={catalog.repositoryUrl}>{catalog.repositoryUrl}</a>
          </li>
          <li>
            {t.install.ghPages.stepIndex}{" "}
            <a href={catalog.pagesCatalogUrl}>catalog.json</a>
            {t.listSep}
            <a href={catalog.pagesManifestUrl}>manifest.json</a>
          </li>
          <li>{t.install.ghPages.stepRegister}</li>
        </ol>
        <pre className="code-block">{installCmd}</pre>
        <div className="copy-row">
          <button type="button" className="btn" onClick={() => onCopy(installCmd)}>
            {t.install.ghPages.copyClaude}
          </button>
          <button type="button" className="btn" onClick={() => onCopy(browseLines)}>
            {t.install.ghPages.copyLinks}
          </button>
        </div>
        <p className="note note-spaced">
          {t.install.ghPages.manifest}{" "}
          <a href={catalog.marketplaceManifestRawUrl}>
            <code>.claude-plugin/marketplace.json</code>
          </a>
        </p>
      </div>

      <div
        role="tabpanel"
        id="panel-marketplace"
        className={`tabpanel${active === TAB_MARKETPLACE ? " is-active" : ""}`}
        hidden={active !== TAB_MARKETPLACE}
      >
        <p className="note">
          {t.install.marketplace.note}{" "}
          <code>{catalog.marketplaceName}</code>
          {locale === LOCALE_ZH ? `（${pluginList}）。` : ` (${pluginList}).`}
        </p>
        <ul className="install-bullets">
          <li>
            {t.install.marketplace.gitSource}{" "}
            <code>{catalog.cloneUrl}</code>
          </li>
          <li>
            {t.install.marketplace.manifest}{" "}
            <code>.claude-plugin/marketplace.json</code>
          </li>
          <li>
            {t.install.marketplace.pluginsDir} <code>plugins/</code>
          </li>
        </ul>
        <pre className="code-block">{installCmd}</pre>
        <div className="copy-row">
          <button type="button" className="btn" onClick={() => onCopy(installCmd)}>
            {t.install.marketplace.copyPlugin}
          </button>
        </div>
        <p className="note note-spaced">
          {t.install.marketplace.docs}{" "}
          <a href={CLAUDE_PLUGINS_DOCS_URL}>Claude Code plugins</a>
        </p>
      </div>

      <div
        role="tabpanel"
        id="panel-clone"
        className={`tabpanel${active === TAB_CLONE ? " is-active" : ""}`}
        hidden={active !== TAB_CLONE}
      >
        <p className="note">{t.install.clone.note}</p>
        <pre className="code-block">{cloneBlock}</pre>
        <div className="copy-row">
          <button
            type="button"
            className="btn"
            onClick={() => onCopy(catalog.cloneUrl)}
          >
            {t.install.clone.copyHttps}
          </button>
          <button type="button" className="btn" onClick={() => onCopy(cloneOneLiner)}>
            {t.install.clone.copyOneLiner}
          </button>
        </div>
      </div>

      <div
        role="tabpanel"
        id="panel-copy"
        className={`tabpanel${active === TAB_COPY ? " is-active" : ""}`}
        hidden={active !== TAB_COPY}
      >
        <p className="note">{t.install.copySkills.note}</p>
        {catalog.skills.map((s: Skill) => (
          <div key={s.folder} className="panel copy-panel">
            <h3>
              <code>{s.id}</code>{" "}
              <span className="path-hint">({s.path})</span>
            </h3>
            <pre className="code-block">{s.copyCommand}</pre>
            <div className="copy-row">
              <button
                type="button"
                className="btn"
                onClick={() => onCopy(s.copyCommand)}
              >
                {t.install.copySkills.copyCmd}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
