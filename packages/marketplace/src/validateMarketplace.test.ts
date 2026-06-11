import { describe, expect, it } from "vitest";

import { repoRoot } from "./repoRoot.js";
import { validateMarketplaceAt } from "./validateMarketplace.js";

describe("validateMarketplaceAt", () => {
  it("passes for this repository", () => {
    const errors = validateMarketplaceAt(repoRoot());
    expect(errors).toEqual([]);
  });
});
