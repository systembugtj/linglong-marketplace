import path from "node:path";
import { fileURLToPath } from "node:url";

/** Monorepo root when running tests from packages/skill-validator. */
export function linglongMarketplaceRoot(): string {
  return path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../..",
  );
}
