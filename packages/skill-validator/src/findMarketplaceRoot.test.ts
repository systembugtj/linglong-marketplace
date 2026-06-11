import { describe, expect, it } from "vitest";

import { findMarketplaceRoot } from "./findMarketplaceRoot.js";
import { linglongMarketplaceRoot } from "./testFixtures.js";

describe("findMarketplaceRoot", () => {
  it("finds repo root from a plugin subdirectory", () => {
    const root = linglongMarketplaceRoot();
    const fromPlugin = findMarketplaceRoot(`${root}/plugins/tauri-plugin`);
    expect(fromPlugin).toBe(root);
  });

  it("returns null outside any marketplace", () => {
    expect(findMarketplaceRoot("/tmp")).toBeNull();
  });
});
