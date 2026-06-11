import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { InstallTabs } from "./components/InstallTabs";
import { useCopyFeedback } from "./hooks/useCopyFeedback";
import { useSiteCatalog } from "./hooks/useSiteCatalog";
import { filterSkillsByQuery } from "./lib/filterSkills";
import { buildCurlInstallCommand } from "./lib/installCommands";

function Shell({
  children,
  live,
  gitHubHref,
}: {
  children: ReactNode;
  live: string;
  /** 仅在 catalog 加载完成后提供，用于侧栏 GitHub 链接。 */
  gitHubHref?: string;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);

  return (
    <>
      <div
        id="aria-live-polite"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {live}
      </div>
      <a className="skip-link" href="#skills">
        跳到技能目录
      </a>
      <div className="layout">
        <aside
          id="rail"
          className={navOpen ? "is-open" : undefined}
          aria-label="章节导航"
        >
          <p className="rail-title">Linglong</p>
          <nav>
            <a href="#overview" onClick={closeNav}>
              概览
            </a>
            <a href="#install" onClick={closeNav}>
              安装
            </a>
            <a href="#plugins" onClick={closeNav}>
              插件
            </a>
            <a href="#skills" onClick={closeNav}>
              目录
            </a>
            <a href="#quality" onClick={closeNav}>
              校验
            </a>
            {gitHubHref ? (
              <a
                href={gitHubHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNav}
              >
                GitHub
              </a>
            ) : null}
          </nav>
        </aside>
        <div className="main-col">
          <div className="topbar">
            <span className="topbar-title">Linglong</span>
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={navOpen}
              aria-controls="rail"
              onClick={() => setNavOpen((o) => !o)}
            >
              菜单
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const state = useSiteCatalog();
  const { live, copyText } = useCopyFeedback();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (state.status === "ok") {
      document.title = `${state.data.marketTitle} · Linglong`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", state.data.metaDescription);
    }
  }, [state]);

  const filtered = useMemo(() => {
    if (state.status !== "ok") return [];
    return filterSkillsByQuery(state.data.skills, filter);
  }, [state, filter]);

  if (state.status === "loading") {
    return (
      <Shell live={live}>
        <main className="page-main">
          <div className="wrap">
            <p className="lede state-msg">正在加载 catalog…</p>
          </div>
        </main>
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell live={live}>
        <main className="page-main">
          <div className="wrap">
            <div className="panel state-error">
              <p className="note">
                无法加载 <code>catalog.json</code>：{state.message}
              </p>
              <p className="note">
                本地开发请运行 <code>pnpm dev</code>（会自动 export catalog）。
              </p>
            </div>
          </div>
        </main>
      </Shell>
    );
  }

  const c = state.data;
  const curlInstall = buildCurlInstallCommand(c);

  return (
    <Shell live={live} gitHubHref={c.repositoryUrl}>
      <header className="site">
        <div className="wrap">
          <div className="brand">
            <h1>{c.marketTitle}</h1>
            <span className="tag">玲珑 · Claude Code</span>
          </div>
          <p className="lede">{c.metaDescription}</p>
          <p className="lede lede-tight">
            本页是 <strong>linglong-marketplace</strong> 的完整介绍：浏览插件与
            skill、复制安装命令，或一键安装到 Claude Code。
          </p>
          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={c.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub 仓库
            </a>
            <a className="btn btn-ghost" href="#install">
              安装指南
            </a>
            <button
              type="button"
              className="btn"
              onClick={() => void copyText(curlInstall)}
            >
              复制 curl 安装
            </button>
          </div>
          <div className="meta-bar">
            <span>
              仓库{" "}
              <a href={c.repositoryUrl}>
                <code>{c.repository}</code>
              </a>
            </span>
            <span>
              分支 <code>{c.sourceBranch}</code>
            </span>
            <span>
              构建 <code>{c.generatedAt}</code>
            </span>
            {c.version ? (
              <span>
                Manifest <code>v{c.version}</code>
              </span>
            ) : null}
            <span>
              Pages{" "}
              <a href={c.pagesUrl}>
                <code>{c.repoName}</code>
              </a>
            </span>
          </div>
        </div>
      </header>
      <main className="page-main">
        <div className="wrap">
          <section id="overview" aria-labelledby="ov-h">
            <h2 id="ov-h">概览</h2>
            <div className="panel panel-highlight">
              <p className="note tight">
                <strong>linglong-marketplace</strong> 是面向 Tauri、RFC 工作流与
                macOS SwiftPM 的 Claude Code 插件市场。本站在{" "}
                <a href={c.pagesUrl}>GitHub Pages</a> 托管；源码在{" "}
                <a href={c.repositoryUrl}>GitHub</a>。
              </p>
              <p className="note tight">
                最快安装（macOS / Linux，需 Claude CLI）：
              </p>
              <pre className="code-block code-block-compact">{curlInstall}</pre>
              <p className="note tight">
                Claude Code 会话内也可用 <code>/plugin</code> 命令（Git HTTPS
                源，不是 Pages URL）。详见下方「安装」。
              </p>
            </div>
            <div className="panel">
              <p className="note tight">
                本页列出 <code>{c.marketplaceName}</code> 中的全部 skill 与
                plugin。数据来自{" "}
                <code>.claude-plugin/marketplace.json</code> 与各{" "}
                <code>SKILL.md</code>。
              </p>
              <p className="note">
                机器可读：{" "}
                <a href={c.pagesCatalogUrl}>catalog.json</a> ·{" "}
                <a href={c.pagesManifestUrl}>manifest.json</a>
              </p>
            </div>
          </section>

          <section id="install" aria-labelledby="in-h">
            <h2 id="in-h">安装</h2>
            <InstallTabs catalog={c} onCopy={(t) => void copyText(t)} />
          </section>

          <section id="plugins" aria-labelledby="pl-h">
            <h2 id="pl-h">插件</h2>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>插件</th>
                    <th>说明</th>
                    <th>Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {c.plugins.map((p) => (
                    <tr key={p.name}>
                      <td>
                        <code>{p.name}</code>
                      </td>
                      <td>{p.description}</td>
                      <td>{p.skillCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="skills" aria-labelledby="sk-h">
            <h2 id="sk-h">Skill 目录</h2>
            <div className="skill-toolbar">
              <label htmlFor="skill-filter">筛选</label>
              <input
                type="search"
                id="skill-filter"
                name="q"
                placeholder="按名称、路径、描述搜索…"
                autoComplete="off"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="skill-grid">
              {filtered.map((s) => (
                <article
                  key={s.folder}
                  className="card"
                  id={`skill-${s.id.replace(/\s+/g, "-")}`}
                >
                  <h3>{s.id}</h3>
                  <p className="path-hint">{s.path}</p>
                  <p className="desc">{s.description}</p>
                  <div className="links">
                    <a
                      href={s.folderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      源码
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="quality" aria-labelledby="qa-h">
            <h2 id="qa-h">本地校验</h2>
            <div className="panel">
              <p className="note">
                贡献者：推送前请运行与 Husky 相同的检查。
              </p>
              <pre className="code-block">
                {`corepack enable
pnpm install
pnpm check`}
              </pre>
              <div className="copy-row">
                <button
                  type="button"
                  className="btn"
                  onClick={() => void copyText("pnpm check")}
                >
                  复制
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="site">
        <div className="wrap">
          <p>
            <a href={c.repositoryUrl}>{c.repository}</a> ·{" "}
            <a href={c.pagesUrl}>GitHub Pages</a> · 分支{" "}
            <code>{c.sourceBranch}</code> · <a href="#overview">回顶部</a>
          </p>
        </div>
      </footer>
    </Shell>
  );
}
