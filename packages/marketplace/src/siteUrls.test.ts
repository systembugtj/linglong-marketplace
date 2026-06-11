import { describe, expect, it } from "vitest";

import { repoRoot } from "./repoRoot.js";
import {
  githubHttpsCloneUrl,
  githubPagesBaseUrl,
  marketplaceManifestRawUrl,
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

describe("git origin", () => {
  it("reads this repo slug", () => {
    const root = repoRoot();
    expect(readGitOriginSlug(root)).toBe("systembugtj/linglong-marketplace");
    expect(resolveRepositorySlug(root)).toBe("systembugtj/linglong-marketplace");
  });
});
