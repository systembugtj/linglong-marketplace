import { describe, expect, it } from "vitest";

import { repoRoot } from "./repoRoot.js";
import { CANONICAL_GITHUB_REPOSITORY } from "@linglongjs/skill-validator";

import {
  githubHttpsCloneUrl,
  githubPagesBaseUrl,
  marketplaceManifestRawUrl,
  normalizeRepositorySlug,
  parseGithubSlugFromRemote,
  readGitOriginSlug,
  resolveRepositorySlug,
} from "./siteUrls.js";

describe("parseGithubSlugFromRemote", () => {
  it("parses ssh remotes", () => {
    expect(
      parseGithubSlugFromRemote(
        "git@github.com:systembugtj/linglong-marketplace.git",
      ),
    ).toBe("systembugtj/linglong-marketplace");
  });

  it("parses https remotes", () => {
    expect(
      parseGithubSlugFromRemote(
        "https://github.com/systembugtj/linglong-marketplace.git",
      ),
    ).toBe("systembugtj/linglong-marketplace");
  });
});

describe("github URLs", () => {
  it("builds pages and clone URLs", () => {
    expect(githubPagesBaseUrl("systembugtj/linglong-marketplace")).toBe(
      "https://systembugtj.github.io/linglong-marketplace/",
    );
    expect(githubHttpsCloneUrl("systembugtj/linglong-marketplace")).toBe(
      "https://github.com/systembugtj/linglong-marketplace.git",
    );
    expect(
      marketplaceManifestRawUrl("systembugtj/linglong-marketplace", "main"),
    ).toBe(
      "https://github.com/systembugtj/linglong-marketplace/raw/main/.claude-plugin/marketplace.json",
    );
  });
});

describe("normalizeRepositorySlug", () => {
  it("rewrites deprecated luban-ws slug to canonical", () => {
    expect(normalizeRepositorySlug("luban-ws/linglong-marketplace")).toBe(
      CANONICAL_GITHUB_REPOSITORY,
    );
    expect(normalizeRepositorySlug("systembugtj/linglong-marketplace")).toBe(
      CANONICAL_GITHUB_REPOSITORY,
    );
  });
});

describe("git origin", () => {
  it("reads this repo slug", () => {
    const root = repoRoot();
    expect(readGitOriginSlug(root)).toBe(CANONICAL_GITHUB_REPOSITORY);
    expect(resolveRepositorySlug(root)).toBe(CANONICAL_GITHUB_REPOSITORY);
  });

  it("maps LINGLONG_GITHUB_REPOSITORY override through normalization", () => {
    const prev = process.env.LINGLONG_GITHUB_REPOSITORY;
    process.env.LINGLONG_GITHUB_REPOSITORY = "luban-ws/linglong-marketplace";
    try {
      expect(resolveRepositorySlug("/tmp")).toBe(CANONICAL_GITHUB_REPOSITORY);
    } finally {
      if (prev === undefined) delete process.env.LINGLONG_GITHUB_REPOSITORY;
      else process.env.LINGLONG_GITHUB_REPOSITORY = prev;
    }
  });
});
