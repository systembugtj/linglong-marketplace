import fs from "node:fs";
import path from "node:path";

import {
  discoverSkillDirs,
  parseFrontmatterFile,
  resolveRepoPath,
} from "@linglongjs/skill-validator";
import type { MarketplaceManifest, MarketplacePluginEntry } from "./types.js";
import {
  githubHttpsCloneUrl,
  githubPagesBaseUrl,
  githubRepositoryUrl,
  installScriptRawUrl,
  marketplaceManifestRawUrl,
} from "./siteUrls.js";
import type { SiteCatalog } from "./types.js";

function collectSkills(
  base: string,
  manifest: MarketplaceManifest,
  repo: string,
  branch: string,
): SiteCatalog["skills"] {
  const baseTree = `https://github.com/${repo}/tree/${branch}`;
  const out: SiteCatalog["skills"] = [];

  for (const plugin of manifest.plugins ?? []) {
    if (!plugin || typeof plugin !== "object") continue;
    const source = (plugin as MarketplacePluginEntry).source ?? "";
    if (!source.trim()) continue;
    const pluginRoot = resolveRepoPath(base, source);
    for (const skillDir of discoverSkillDirs(pluginRoot)) {
      const skillMd = path.join(skillDir, "SKILL.md");
      const fm = parseFrontmatterFile(skillMd);
      const name = String(fm.name ?? path.basename(skillDir));
      const folderName = path.basename(skillDir);
      const desc = String(fm.description ?? "").trim();
      const rel = path.relative(base, skillDir);
      const copyCmd = `cp -R ${rel} ~/.claude/skills/${folderName}`;
      out.push({
        id: name,
        folder: folderName,
        path: rel,
        description: desc,
        folderUrl: `${baseTree}/${rel}`,
        copyCommand: copyCmd,
        search: `${name} ${desc} ${rel} ${folderName}`.toLowerCase(),
      });
    }
  }
  return out;
}

export function buildSiteCatalog(
  base: string,
  manifest: MarketplaceManifest,
  options: { repo: string; branch: string; generatedAt: string },
): { catalog: SiteCatalog; manifestPublic: Record<string, unknown> } {
  const { repo, branch, generatedAt } = options;
  const meta = manifest.metadata ?? {};
  const marketTitle = String(manifest.name ?? "marketplace");
  const metaDesc = String(meta.description ?? "Claude Code skill marketplace.");
  const version = meta.version ? String(meta.version) : null;
  const skills = collectSkills(base, manifest, repo, branch);
  const cloneUrl = githubHttpsCloneUrl(repo);
  const repoName = repo.includes("/") ? repo.split("/").pop()! : repo;
  const pagesBase = githubPagesBaseUrl(repo);

  const pluginsOut = (manifest.plugins ?? [])
    .filter((p): p is MarketplacePluginEntry => !!p && typeof p === "object")
    .map((p) => {
      const source = p.source ?? "";
      const pluginRoot = source.trim()
        ? resolveRepoPath(base, source)
        : null;
      const nskills = pluginRoot ? discoverSkillDirs(pluginRoot).length : 0;
      return {
        name: String(p.name ?? ""),
        description: String(p.description ?? ""),
        skillCount: nskills,
      };
    });

  const catalog: SiteCatalog = {
    marketTitle,
    metaDescription: metaDesc,
    version,
    generatedAt,
    repository: repo,
    sourceBranch: branch,
    cloneUrl,
    repoName,
    marketplaceName: marketTitle,
    pagesUrl: pagesBase,
    pagesCatalogUrl: pagesBase ? `${pagesBase}catalog.json` : "",
    pagesManifestUrl: pagesBase ? `${pagesBase}manifest.json` : "",
    marketplaceManifestRawUrl: marketplaceManifestRawUrl(repo, branch),
    repositoryUrl: githubRepositoryUrl(repo),
    installScriptRawUrl: installScriptRawUrl(repo, branch),
    installScriptPagesUrl: pagesBase ? `${pagesBase}install.sh` : "",
    plugins: pluginsOut,
    skills,
  };

  const manifestPublic = {
    name: marketTitle,
    version,
    description: metaDesc,
    repository: repo,
    sourceBranch: branch,
    generatedAt,
    skills: skills.map((s) => ({
      name: s.id,
      path: s.path,
      description: s.description,
      folderUrl: s.folderUrl,
      copyCommand: s.copyCommand,
    })),
  };

  return { catalog, manifestPublic };
}

export function writePublicCatalog(
  base: string,
  publicDir: string,
  options: { repo: string; branch: string; generatedAt?: string },
): void {
  const mpPath = path.join(base, ".claude-plugin", "marketplace.json");
  const manifest = JSON.parse(
    fs.readFileSync(mpPath, "utf8"),
  ) as MarketplaceManifest;
  const generatedAt =
    options.generatedAt ?? new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const { catalog, manifestPublic } = buildSiteCatalog(base, manifest, {
    repo: options.repo,
    branch: options.branch,
    generatedAt,
  });

  fs.mkdirSync(publicDir, { recursive: true });
  const writeJson = (file: string, data: unknown) =>
    fs.writeFileSync(
      path.join(publicDir, file),
      `${JSON.stringify(data, null, 2)}\n`,
      "utf8",
    );
  writeJson("catalog.json", catalog);
  writeJson("manifest.json", manifestPublic);
  const nojekyll = path.join(publicDir, ".nojekyll");
  if (!fs.existsSync(nojekyll)) fs.writeFileSync(nojekyll, "", "utf8");

  const installSh = path.join(base, "install.sh");
  if (fs.existsSync(installSh)) {
    fs.copyFileSync(installSh, path.join(publicDir, "install.sh"));
  }
}
