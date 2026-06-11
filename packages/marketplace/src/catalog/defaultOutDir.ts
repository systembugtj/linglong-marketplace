import fs from "node:fs";
import path from "node:path";

/** Prefer `site/public` (this monorepo); else `public/` under marketplace root. */
export function defaultCatalogOutDir(marketplaceRoot: string): string {
  const sitePublic = path.join(marketplaceRoot, "site", "public");
  if (fs.existsSync(path.join(marketplaceRoot, "site"))) {
    return sitePublic;
  }
  return path.join(marketplaceRoot, "public");
}
