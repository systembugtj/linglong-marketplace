import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { InstallTabs } from "./components/InstallTabs";
import { LanguageToggle } from "./components/LanguageToggle";
import { useCopyFeedback } from "./hooks/useCopyFeedback";
import { useSiteCatalog } from "./hooks/useSiteCatalog";
import { useLocale } from "./i18n/LocaleContext";
import { filterSkillsByQuery } from "./lib/filterSkills";
import { buildCurlInstallCommand } from "./lib/installCommands";

function Shell({
  children,
  live,
  gitHubHref,
}: {
  children: ReactNode;
  live: string;
  gitHubHref?: string;
}) {
  const { messages: m } = useLocale();
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
        {m.skipLink}
      </a>
      <div className="layout">
        <aside
          id="rail"
          className={navOpen ? "is-open" : undefined}
          aria-label={m.navAria}
        >
          <div className="rail-head">
            <p className="rail-title">Linglong</p>
            <LanguageToggle className="lang-toggle--rail" />
          </div>
          <nav>
            <a href="#overview" onClick={closeNav}>
              {m.nav.overview}
            </a>
            <a href="#install" onClick={closeNav}>
              {m.nav.install}
            </a>
            <a href="#plugins" onClick={closeNav}>
              {m.nav.plugins}
            </a>
            <a href="#skills" onClick={closeNav}>
              {m.nav.catalog}
            </a>
            <a href="#quality" onClick={closeNav}>
              {m.nav.quality}
            </a>
            {gitHubHref ? (
              <a
                href={gitHubHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeNav}
              >
                {m.nav.github}
              </a>
            ) : null}
          </nav>
        </aside>
        <div className="main-col">
          <div className="topbar">
            <span className="topbar-title">Linglong</span>
            <div className="topbar-actions">
              <LanguageToggle />
              <button
                type="button"
                className="nav-toggle"
                aria-expanded={navOpen}
                aria-controls="rail"
                onClick={() => setNavOpen((o) => !o)}
              >
                {m.nav.menu}
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const { messages: m } = useLocale();
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
            <p className="lede state-msg">{m.loading}</p>
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
                {m.error.loadFailed} <code>catalog.json</code>：{state.message}
              </p>
              <p className="note">{m.error.devHint}</p>
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
            <span className="tag">{m.brandTag}</span>
          </div>
          <p className="lede">{c.metaDescription}</p>
          <p className="lede lede-tight">{m.hero.lede}</p>
          <div className="hero-actions">
            <a
              className="btn btn-primary"
              href={c.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {m.hero.repoBtn}
            </a>
            <a className="btn btn-ghost" href="#install">
              {m.hero.installBtn}
            </a>
            <button
              type="button"
              className="btn"
              onClick={() => void copyText(curlInstall)}
            >
              {m.hero.copyCurlBtn}
            </button>
          </div>
          <div className="meta-bar">
            <span>
              {m.meta.repo}{" "}
              <a href={c.repositoryUrl}>
                <code>{c.repository}</code>
              </a>
            </span>
            <span>
              {m.meta.branch} <code>{c.sourceBranch}</code>
            </span>
            <span>
              {m.meta.built} <code>{c.generatedAt}</code>
            </span>
            {c.version ? (
              <span>
                {m.meta.manifest} <code>v{c.version}</code>
              </span>
            ) : null}
            <span>
              {m.meta.pages}{" "}
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
            <h2 id="ov-h">{m.overview.title}</h2>
            <div className="panel panel-highlight">
              <p className="note tight">
                {m.overview.highlight}{" "}
                <a href={c.pagesUrl}>GitHub Pages</a>
                {m.overview.highlightSuffix}{" "}
                <a href={c.repositoryUrl}>GitHub</a>
                {m.overview.highlightEnd}
              </p>
              <p className="note tight">{m.overview.fastest}</p>
              <pre className="code-block code-block-compact">{curlInstall}</pre>
              <p className="note tight">{m.overview.pluginHint}</p>
            </div>
            <div className="panel">
              <p className="note tight">
                {m.overview.catalogNote} <code>{c.marketplaceName}</code>
                {m.overview.catalogNoteSuffix}
              </p>
              <p className="note">
                {m.overview.machineReadable}{" "}
                <a href={c.pagesCatalogUrl}>catalog.json</a> ·{" "}
                <a href={c.pagesManifestUrl}>manifest.json</a>
              </p>
            </div>
          </section>

          <section id="install" aria-labelledby="in-h">
            <h2 id="in-h">{m.install.title}</h2>
            <InstallTabs catalog={c} onCopy={(t) => void copyText(t)} />
          </section>

          <section id="plugins" aria-labelledby="pl-h">
            <h2 id="pl-h">{m.plugins.title}</h2>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{m.plugins.colPlugin}</th>
                    <th>{m.plugins.colDesc}</th>
                    <th>{m.plugins.colSkills}</th>
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
            <h2 id="sk-h">{m.skills.title}</h2>
            <div className="skill-toolbar">
              <label htmlFor="skill-filter">{m.skills.filter}</label>
              <input
                type="search"
                id="skill-filter"
                name="q"
                placeholder={m.skills.placeholder}
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
                      {m.skills.source}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="quality" aria-labelledby="qa-h">
            <h2 id="qa-h">{m.quality.title}</h2>
            <div className="panel">
              <p className="note">{m.quality.note}</p>
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
                  {m.quality.copy}
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
            <a href={c.pagesUrl}>GitHub Pages</a> · {m.footer.branch}{" "}
            <code>{c.sourceBranch}</code> ·{" "}
            <a href="#overview">{m.footer.backTop}</a>
          </p>
        </div>
      </footer>
    </Shell>
  );
}
