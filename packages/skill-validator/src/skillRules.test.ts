import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { parseFrontmatterText, validateSkillFrontmatter } from "./skillRules.js";

const tempDirs: string[] = [];

function writeTempSkill(body: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "linglong-skill-"));
  tempDirs.push(dir);
  const skillMd = path.join(dir, "SKILL.md");
  fs.writeFileSync(skillMd, body, "utf8");
  return skillMd;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("parseFrontmatterText", () => {
  it("parses valid YAML frontmatter", () => {
    const fm = parseFrontmatterText(`---
name: demo-skill
description: A demo skill for tests.
---
# Body`);
    expect(fm.name).toBe("demo-skill");
    expect(fm.description).toBe("A demo skill for tests.");
  });
});

describe("validateSkillFrontmatter", () => {
  it("rejects angle brackets in description", () => {
    const skillMd = writeTempSkill(`---
name: demo-skill
description: bad <tag>
---
`);
    const errors = validateSkillFrontmatter(skillMd);
    expect(errors.some((e) => e.includes("angle brackets"))).toBe(true);
  });
});
