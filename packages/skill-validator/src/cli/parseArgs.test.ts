import { describe, expect, it } from "vitest";

import { formatHelp, parseCliArgs } from "./parseArgs.js";

describe("parseCliArgs", () => {
  it("defaults with no args", () => {
    expect(parseCliArgs([])).toEqual({
      help: false,
      version: false,
      path: null,
    });
  });

  it("parses positional path", () => {
    expect(parseCliArgs(["./my-marketplace"])).toEqual({
      help: false,
      version: false,
      path: "./my-marketplace",
    });
  });

  it("parses --path", () => {
    expect(parseCliArgs(["-p", "/tmp/repo"])).toEqual({
      help: false,
      version: false,
      path: "/tmp/repo",
    });
  });

  it("sets help flag", () => {
    expect(parseCliArgs(["--help"]).help).toBe(true);
  });
});

describe("formatHelp", () => {
  it("mentions npx install path", () => {
    expect(formatHelp()).toContain("npx @linglongjs/skill-validator");
  });
});
