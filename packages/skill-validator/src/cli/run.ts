import path from "node:path";

import { findMarketplaceRoot } from "../findMarketplaceRoot.js";
import { validateMarketplaceAt } from "../validateMarketplace.js";
import {
  CLI_NAME,
  VERSION,
  formatHelp,
  parseCliArgs,
} from "./parseArgs.js";

export function resolveValidationRoot(options: {
  cwd: string;
  explicitPath: string | null;
}): { base: string; discovered: boolean } {
  if (options.explicitPath) {
    return {
      base: path.resolve(options.cwd, options.explicitPath),
      discovered: false,
    };
  }
  const discovered = findMarketplaceRoot(options.cwd);
  if (discovered) return { base: discovered, discovered: true };
  return { base: options.cwd, discovered: false };
}

export function runCli(argv: string[], cwd = process.cwd()): number {
  let options;
  try {
    options = parseCliArgs(argv);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`${CLI_NAME}: ${message}`);
    console.error(`Run '${CLI_NAME} --help' for usage.`);
    return 1;
  }

  if (options.help) {
    console.log(formatHelp());
    return 0;
  }

  if (options.version) {
    console.log(VERSION);
    return 0;
  }

  const { base, discovered } = resolveValidationRoot({
    cwd,
    explicitPath: options.path,
  });

  const errors = validateMarketplaceAt(base);
  if (errors.length > 0) {
    console.error(`${CLI_NAME}: validation failed for ${base}`);
    for (const line of errors) console.error(`  ✗ ${line}`);
    console.error(`\nFix errors above, then run '${CLI_NAME}' again.`);
    return 1;
  }

  const hint =
    discovered && !options.path ? " (auto-detected marketplace root)" : "";
  console.log(`✓ Skills OK${hint}`);
  console.log(`  ${base}`);
  return 0;
}
