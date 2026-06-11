import path from "node:path";

import { findMarketplaceRoot } from "@linglongjs/skill-validator";

import { defaultCatalogOutDir } from "../../catalog/defaultOutDir.js";
import { writePublicCatalog } from "../../exportCatalog.js";
import {
  resolveRepositorySlug,
  resolveSourceBranch,
} from "../../siteUrls.js";
import {
  CLI_NAME,
  VERSION,
  formatCatalogHelp,
  parseCatalogCliArgs,
} from "./parseArgs.js";

export function resolveCatalogPaths(options: {
  cwd: string;
  explicitPath: string | null;
  explicitOut: string | null;
}): { marketplaceRoot: string; outDir: string; discovered: boolean } {
  let marketplaceRoot: string;
  let discovered = false;

  if (options.explicitPath) {
    marketplaceRoot = path.resolve(options.cwd, options.explicitPath);
  } else {
    const found = findMarketplaceRoot(options.cwd);
    marketplaceRoot = found ?? options.cwd;
    discovered = found !== null;
  }

  const outDir = options.explicitOut
    ? path.resolve(options.cwd, options.explicitOut)
    : defaultCatalogOutDir(marketplaceRoot);

  return { marketplaceRoot, outDir, discovered };
}

export function runCatalogCli(argv: string[], cwd = process.cwd()): number {
  let options;
  try {
    options = parseCatalogCliArgs(argv);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`${CLI_NAME}: ${message}`);
    console.error(`Run '${CLI_NAME} --help' for usage.`);
    return 1;
  }

  if (options.help) {
    console.log(formatCatalogHelp());
    return 0;
  }

  if (options.version) {
    console.log(VERSION);
    return 0;
  }

  const { marketplaceRoot, outDir, discovered } = resolveCatalogPaths({
    cwd,
    explicitPath: options.path,
    explicitOut: options.outDir,
  });

  const repo = resolveRepositorySlug(marketplaceRoot);
  const branch = resolveSourceBranch(marketplaceRoot);

  writePublicCatalog(marketplaceRoot, outDir, { repo, branch });

  const hint =
    discovered && !options.path ? " (auto-detected marketplace root)" : "";
  console.log(`✓ Catalog exported${hint}`);
  console.log(`  marketplace: ${marketplaceRoot}`);
  console.log(`  output:      ${outDir}`);
  return 0;
}
