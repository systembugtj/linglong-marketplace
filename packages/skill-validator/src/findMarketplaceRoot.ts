import fs from "node:fs";
import path from "node:path";

import { MARKETPLACE_MANIFEST_REL } from "./constants.js";

/** Walk parents until `.claude-plugin/marketplace.json` is found. */
export function findMarketplaceRoot(startDir: string): string | null {
  let dir = path.resolve(startDir);
  const fsRoot = path.parse(dir).root;

  while (true) {
    const manifest = path.join(dir, MARKETPLACE_MANIFEST_REL);
    if (fs.existsSync(manifest)) return dir;
    if (dir === fsRoot) return null;
    dir = path.dirname(dir);
  }
}
