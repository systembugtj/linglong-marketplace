#!/usr/bin/env node
import { repoRoot } from "../repoRoot.js";
import { validateMarketplaceAt } from "../validateMarketplace.js";

const errors = validateMarketplaceAt(repoRoot());
if (errors.length > 0) {
  console.error("Marketplace validation failed:");
  for (const line of errors) console.error(`  - ${line}`);
  process.exit(1);
}
console.log("Marketplace OK: manifest and all skills valid.");
