import fs from "node:fs";
import path from "node:path";

import {
  PLUGIN_MANIFEST_DIR,
  PLUGIN_MANIFEST_NAME,
  PLUGIN_NAME_PATTERN,
} from "./constants.js";
import { discoverSkillDirs, pluginsRoot, resolveRepoPath } from "./paths.js";
import { validateSkillFrontmatter } from "./skillRules.js";
import type { MarketplaceManifest, MarketplacePluginEntry } from "./types.js";

function validatePluginManifest(
  manifestPath: string,
  prefix: string,
): string[] {
  const errors: string[] = [];
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    return [`${prefix}: invalid plugin.json: ${err instanceof Error ? err.message : String(err)}`];
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return [`${prefix}: plugin.json root must be an object`];
  }
  const name = (data as { name?: unknown }).name;
  if (typeof name !== "string" || !name) {
    errors.push(`${prefix}: plugin.json missing 'name'`);
  } else if (!PLUGIN_NAME_PATTERN.test(name)) {
    errors.push(`${prefix}: plugin.json name should be kebab-case: ${JSON.stringify(name)}`);
  }
  return errors;
}

function walkSkillMdFiles(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkSkillMdFiles(full));
    else if (entry.isFile() && entry.name === "SKILL.md") out.push(full);
  }
  return out;
}

export function collectMarketplaceErrors(
  base: string,
  manifest: MarketplaceManifest,
  mpPath: string,
): string[] {
  const errors: string[] = [];
  if (!manifest.name) errors.push(`${mpPath}: missing top-level 'name'`);
  if (!manifest.plugins) {
    errors.push(`${mpPath}: missing 'plugins' array`);
    return errors;
  }
  if (!Array.isArray(manifest.plugins)) {
    errors.push(`${mpPath}: 'plugins' must be an array`);
    return errors;
  }

  const registeredSkillRoots = new Set<string>();

  manifest.plugins.forEach((plugin, idx) => {
    const prefix = `${mpPath} plugins[${idx}]`;
    if (!plugin || typeof plugin !== "object") {
      errors.push(`${prefix}: must be an object`);
      return;
    }
    const entry = plugin as MarketplacePluginEntry;
    const pname = entry.name ?? "";
    if (!pname) errors.push(`${prefix}: missing plugin name`);
    else if (!PLUGIN_NAME_PATTERN.test(pname)) {
      errors.push(`${prefix}: plugin name should be kebab-case-ish: ${JSON.stringify(pname)}`);
    }

    const source = entry.source ?? "";
    if (!source.trim()) {
      errors.push(`${prefix}: missing 'source' path`);
      return;
    }

    const pluginRoot = resolveRepoPath(base, source);
    if (!fs.existsSync(pluginRoot) || !fs.statSync(pluginRoot).isDirectory()) {
      errors.push(`${prefix}: plugin source directory missing: ${pluginRoot}`);
      return;
    }

    const pluginManifest = path.join(
      pluginRoot,
      PLUGIN_MANIFEST_DIR,
      PLUGIN_MANIFEST_NAME,
    );
    if (entry.strict) {
      if (!fs.existsSync(pluginManifest)) {
        errors.push(`${prefix}: missing ${PLUGIN_MANIFEST_DIR}/${PLUGIN_MANIFEST_NAME}`);
      } else {
        errors.push(...validatePluginManifest(pluginManifest, `${prefix} (${pluginManifest})`));
      }
    } else if (!fs.existsSync(pluginManifest)) {
      errors.push(
        `${prefix}: recommend strict plugin layout with ${PLUGIN_MANIFEST_DIR}/${PLUGIN_MANIFEST_NAME}`,
      );
    }

    const skillDirs = discoverSkillDirs(pluginRoot);
    if (skillDirs.length === 0) {
      errors.push(`${prefix}: no skills found under ${path.join(pluginRoot, "skills")}`);
      return;
    }

    for (const skillDir of skillDirs) {
      const key = path.relative(base, skillDir);
      if (registeredSkillRoots.has(key)) {
        errors.push(`${prefix}: duplicate skill directory ${JSON.stringify(key)}`);
      }
      registeredSkillRoots.add(key);
      const skillMd = path.join(skillDir, "SKILL.md");
      errors.push(
        ...validateSkillFrontmatter(skillMd, path.relative(base, skillMd)),
      );
    }
  });

  const pluginsDir = pluginsRoot(base);
  for (const skillMd of walkSkillMdFiles(pluginsDir)) {
    const skillRoot = path.relative(base, path.dirname(skillMd));
    if (!registeredSkillRoots.has(skillRoot)) {
      errors.push(
        `orphan SKILL.md outside registered plugin skills/: ${skillRoot}`,
      );
    }
  }

  return errors;
}

export function validateMarketplaceAt(base: string): string[] {
  const mpPath = path.join(base, ".claude-plugin", "marketplace.json");
  if (!fs.existsSync(mpPath)) {
    return [`missing marketplace manifest: ${mpPath}`];
  }
  let manifest: MarketplaceManifest;
  try {
    manifest = JSON.parse(fs.readFileSync(mpPath, "utf8")) as MarketplaceManifest;
  } catch (err) {
    return [`invalid JSON in ${mpPath}: ${err instanceof Error ? err.message : String(err)}`];
  }
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    return [`${mpPath}: root must be a JSON object`];
  }
  return collectMarketplaceErrors(base, manifest, mpPath);
}
