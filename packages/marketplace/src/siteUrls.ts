import { execSync } from "node:child_process";

import { DEFAULT_BRANCH, GITHUB_HOST } from "@linglongjs/skill-validator";

const GITHUB_PAGES_SUFFIX = ".github.io";

export function parseGithubSlugFromRemote(remoteUrl: string): string | null {
  const url = remoteUrl.trim().replace(/\/$/, "");
  let slug: string | null = null;
  if (url.startsWith("git@github.com:")) {
    slug = url.slice("git@github.com:".length);
  } else if (url.startsWith(`https://${GITHUB_HOST}/`)) {
    slug = url.slice(`https://${GITHUB_HOST}/`.length);
  } else if (url.startsWith(`http://${GITHUB_HOST}/`)) {
    slug = url.slice(`http://${GITHUB_HOST}/`.length);
  }
  if (!slug) return null;
  if (slug.endsWith(".git")) slug = slug.slice(0, -4);
  const parts = slug.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return `${parts[0]}/${parts[1]}`;
}

export function readGitOriginSlug(repoRoot: string): string | null {
  try {
    const out = execSync("git remote get-url origin", {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return parseGithubSlugFromRemote(out.trim());
  } catch {
    return null;
  }
}

export function resolveRepositorySlug(repoRoot: string): string {
  const envSlug = process.env.GITHUB_REPOSITORY?.trim();
  if (envSlug) return envSlug;
  const origin = readGitOriginSlug(repoRoot);
  if (origin) return origin;
  throw new Error(
    "cannot determine owner/repo: set GITHUB_REPOSITORY or configure a GitHub origin remote",
  );
}

export function resolveSourceBranch(repoRoot: string): string {
  const envBranch = process.env.GITHUB_REF_NAME?.trim();
  if (envBranch) return envBranch;
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (branch && branch !== "HEAD") return branch;
  } catch {
    /* fall through */
  }
  return DEFAULT_BRANCH;
}

export function githubHttpsCloneUrl(repository: string): string {
  return `https://${GITHUB_HOST}/${repository}.git`;
}

export function githubPagesBaseUrl(repository: string): string {
  const idx = repository.indexOf("/");
  if (idx < 0) return "";
  const owner = repository.slice(0, idx);
  const repoName = repository.slice(idx + 1);
  if (!owner || !repoName) return "";
  return `https://${owner}${GITHUB_PAGES_SUFFIX}/${repoName}/`;
}

export function githubRepositoryUrl(repository: string): string {
  return `https://${GITHUB_HOST}/${repository}`;
}

export function marketplaceManifestRawUrl(
  repository: string,
  branch: string,
): string {
  return `https://${GITHUB_HOST}/${repository}/raw/${branch}/.claude-plugin/marketplace.json`;
}

export function installScriptRawUrl(repository: string, branch: string): string {
  return `https://${GITHUB_HOST}/${repository}/raw/${branch}/install.sh`;
}
