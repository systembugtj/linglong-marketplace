import { describe, expect, it } from "vitest";

import { linglongMarketplaceRoot } from "./testFixtures.js";
import { validateMarketplaceAt } from "./validateMarketplace.js";

describe("validateMarketplaceAt", () => {
  it("passes for linglong-marketplace repository", () => {
    const errors = validateMarketplaceAt(linglongMarketplaceRoot());
    expect(errors).toEqual([]);
  });
});
