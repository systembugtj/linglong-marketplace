import path from "node:path";
import { fileURLToPath } from "node:url";

/** Monorepo root (packages/marketplace/src → ../../..). */
export function repoRoot(): string {
  return path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../..",
  );
}
