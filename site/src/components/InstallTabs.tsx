import { useCallback, useState, type KeyboardEvent } from "react";
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

  const q = tabIdRole(TAB_QUICK, active);
  const gp = tabIdRole(TAB_GH_PAGES, active);
  const m = tabIdRole(TAB_MARKETPLACE, active);
  const c = tabIdRole(TAB_CLONE, active);
  const cp = tabIdRole(TAB_COPY, active);

  return (
    <div className="install-tabs">
      <ul className="tablist" role="tablist" aria-label="安装方式">
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
            快速安装
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
            GitHub Pages
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
            Claude Code
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
            Clone
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
            ~/.claude/skills
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
          在 macOS / Linux 终端运行（需已安装{" "}
          <a
            href="https://code.claude.com/docs/en/cli"
            target="_blank"
            rel="noopener noreferrer"
          >
            Claude Code CLI
          </a>
          ）。脚本会注册 <code>{catalog.marketplaceName}</code> 并安装全部
          plugin。
        </p>
        <p className="note tight">
          源码仓库：{" "}
          <a href={catalog.repositoryUrl}>{catalog.repositoryUrl}</a>
        </p>
        <h3 className="subhead">一行命令（推荐）</h3>
        <pre className="code-block">{curlCmd}</pre>
        <div className="copy-row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onCopy(curlCmd)}
          >
            复制 curl 安装
          </button>
          <a
            className="btn btn-ghost"
            href={catalog.installScriptRawUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            查看 install.sh
          </a>
        </div>
        <h3 className="subhead">克隆后本地运行</h3>
        <pre className="code-block">{`git clone ${catalog.cloneUrl}\ncd ${catalog.repoName}\nsh install.sh`}</pre>
        <div className="copy-row">
          <button
            type="button"
            className="btn"
            onClick={() => onCopy(cliCmd)}
          >
            复制 CLI 命令
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onCopy(curlPagesCmd)}
          >
            复制 Pages 版 curl
          </button>
        </div>
      </div>

      <div
        role="tabpanel"
        id="panel-gh-pages"
        className={`tabpanel${active === TAB_GH_PAGES ? " is-active" : ""}`}
        hidden={active !== TAB_GH_PAGES}
      >
        <p className="note">
          <strong>linglong-marketplace</strong> 通过 GitHub Actions 部署到 GitHub
          Pages：推送 <code>{catalog.sourceBranch}</code> 后自动构建本目录站。
          在此<strong>浏览</strong> skill 列表；在 Claude Code 里用<strong> Git
          仓库</strong>注册 marketplace（不是 Pages URL）。
        </p>
        <ol className="install-steps">
          <li>
            打开 Pages 站点：{" "}
            <a href={catalog.pagesUrl}>{catalog.pagesUrl}</a>
          </li>
          <li>
            Git 仓库：{" "}
            <a href={catalog.repositoryUrl}>{catalog.repositoryUrl}</a>
          </li>
          <li>
            机器可读索引：{" "}
            <a href={catalog.pagesCatalogUrl}>catalog.json</a>、{" "}
            <a href={catalog.pagesManifestUrl}>manifest.json</a>
          </li>
          <li>
            在 Claude Code 注册 marketplace（git 源）并安装 plugin：
          </li>
        </ol>
        <pre className="code-block">{installCmd}</pre>
        <div className="copy-row">
          <button
            type="button"
            className="btn"
            onClick={() => onCopy(installCmd)}
          >
            复制 Claude 安装命令
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onCopy(browseLines)}
          >
            复制 Pages 链接
          </button>
        </div>
        <p className="note note-spaced">
          Marketplace manifest（git raw）：{" "}
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
          将仓库添加为 marketplace <code>{catalog.marketplaceName}</code>
          ，再按需安装 plugin（
          {catalog.plugins.map((p) => p.name).join("、")}）。
        </p>
        <ul className="install-bullets">
          <li>
            Git 源：<code>{catalog.cloneUrl}</code>
          </li>
          <li>
            Manifest：<code>.claude-plugin/marketplace.json</code>
          </li>
          <li>
            Plugin 包位于 <code>plugins/</code>
          </li>
        </ul>
        <pre className="code-block">{installCmd}</pre>
        <div className="copy-row">
          <button
            type="button"
            className="btn"
            onClick={() => onCopy(installCmd)}
          >
            复制 /plugin 命令
          </button>
        </div>
        <p className="note note-spaced">
          文档：{" "}
          <a href={CLAUDE_PLUGINS_DOCS_URL}>Claude Code plugins</a>
        </p>
      </div>

      <div
        role="tabpanel"
        id="panel-clone"
        className={`tabpanel${active === TAB_CLONE ? " is-active" : ""}`}
        hidden={active !== TAB_CLONE}
      >
        <p className="note">
          克隆仓库后，可将本地路径注册为 marketplace，或运行{" "}
          <code>sh install.sh</code>。
        </p>
        <pre className="code-block">{cloneBlock}</pre>
        <div className="copy-row">
          <button
            type="button"
            className="btn"
            onClick={() => onCopy(catalog.cloneUrl)}
          >
            复制 HTTPS 克隆地址
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onCopy(cloneOneLiner)}
          >
            复制一行命令
          </button>
        </div>
      </div>

      <div
        role="tabpanel"
        id="panel-copy"
        className={`tabpanel${active === TAB_COPY ? " is-active" : ""}`}
        hidden={active !== TAB_COPY}
      >
        <p className="note">
          不用 marketplace 时，可将 skill 目录复制到全局 Claude skills 目录。
        </p>
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
                复制命令
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
