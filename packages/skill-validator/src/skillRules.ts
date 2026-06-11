import fs from "node:fs";
import { parse as parseYaml } from "yaml";

import {
  ALLOWED_FRONTMATTER_KEYS,
  DESCRIPTION_MAX_LEN,
  SKILL_NAME_PATTERN,
} from "./constants.js";

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---/;

export function parseFrontmatterText(text: string): Record<string, unknown> {
  const match = FRONTMATTER_PATTERN.exec(text);
  if (!match) throw new Error("missing or invalid YAML frontmatter");
  const loaded = parseYaml(match[1]);
  if (!loaded || typeof loaded !== "object" || Array.isArray(loaded)) {
    throw new Error("frontmatter must be a mapping");
  }
  return loaded as Record<string, unknown>;
}

export function parseFrontmatterFile(skillMdPath: string): Record<string, unknown> {
  return parseFrontmatterText(fs.readFileSync(skillMdPath, "utf8"));
}

export function validateSkillFrontmatter(
  skillMdPath: string,
  relDisplay?: string,
): string[] {
  const label = relDisplay ?? skillMdPath;
  const errors: string[] = [];
  let fm: Record<string, unknown>;
  try {
    fm = parseFrontmatterFile(skillMdPath);
  } catch (err) {
    return [`${label}: ${err instanceof Error ? err.message : String(err)}`];
  }

  const unexpected = Object.keys(fm).filter(
    (key) => !ALLOWED_FRONTMATTER_KEYS.has(key),
  );
  if (unexpected.length > 0) {
    errors.push(
      `${label}: unexpected frontmatter key(s): ${unexpected.sort().join(", ")}`,
    );
  }

  const name = fm.name;
  if (typeof name !== "string" || !name.trim()) {
    errors.push(`${label}: 'name' must be a non-empty string`);
  } else if (!SKILL_NAME_PATTERN.test(name)) {
    errors.push(
      `${label}: 'name' must be kebab-case (lowercase, digits, hyphens): ${JSON.stringify(name)}`,
    );
  } else if (
    name.startsWith("-") ||
    name.endsWith("-") ||
    name.includes("--")
  ) {
    errors.push(`${label}: invalid 'name' hyphen rules: ${JSON.stringify(name)}`);
  } else if (name.length > 64) {
    errors.push(`${label}: 'name' exceeds 64 characters`);
  }

  const desc = fm.description;
  if (typeof desc !== "string") {
    errors.push(`${label}: 'description' must be a string`);
  } else {
    const trimmed = desc.trim();
    if (!trimmed) {
      errors.push(`${label}: 'description' must be non-empty`);
    } else if (trimmed.length > DESCRIPTION_MAX_LEN) {
      errors.push(
        `${label}: 'description' exceeds ${DESCRIPTION_MAX_LEN} characters (${trimmed.length})`,
      );
    } else if (trimmed.includes("<") || trimmed.includes(">")) {
      errors.push(`${label}: 'description' must not contain angle brackets`);
    }
  }

  return errors;
}
