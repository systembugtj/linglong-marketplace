import path from "node:path";
import { describe, expect, it } from "vitest";

import { resolveValidationRoot } from "./run.js";
import { linglongMarketplaceRoot } from "../testFixtures.js";

describe("resolveValidationRoot", () => {
  const repo = linglongMarketplaceRoot();

  it("auto-discovers from plugin subdirectory", () => {
    const cwd = path.join(repo, "plugins", "tauri-plugin");
    const { base, discovered } = resolveValidationRoot({ cwd, explicitPath: null });
    expect(discovered).toBe(true);
    expect(base).toBe(repo);
  });

  it("honors explicit path", () => {
    const { base, discovered } = resolveValidationRoot({
      cwd: "/tmp",
      explicitPath: repo,
    });
    expect(discovered).toBe(false);
    expect(base).toBe(repo);
  });
});
