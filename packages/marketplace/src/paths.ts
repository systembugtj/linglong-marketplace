import fs from "node:fs";
import path from "node:path";

import {
  PLUGIN_MANIFEST_DIR,
  PLUGIN_MANIFEST_NAME,
  PLUGINS_ROOT_REL,
} from "./constants.js";

export function resolveRepoPath(base: string, entry: string): string {
  const raw = entry.trim().replace(/^\.\//, "");
  return path.resolve(base, raw);
}

export function discoverPluginRoots(pluginsDir: string): string[] {
  if (!fs.existsSync(pluginsDir)) return [];
  return fs
    .readdirSync(pluginsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(pluginsDir, d.name))
    .filter((p) =>
      fs.existsSync(path.join(p, PLUGIN_MANIFEST_DIR, PLUGIN_MANIFEST_NAME)),
    )
    .sort();
}

export function discoverSkillDirs(pluginRoot: string): string[] {
  const skillsRoot = path.join(pluginRoot, "skills");
  if (!fs.existsSync(skillsRoot)) return [];
  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(skillsRoot, d.name))
    .filter((p) => fs.existsSync(path.join(p, "SKILL.md")))
    .sort();
}

export function pluginsRoot(base: string): string {
  return path.join(base, PLUGINS_ROOT_REL);
}
