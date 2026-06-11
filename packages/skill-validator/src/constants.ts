export const DESCRIPTION_MAX_LEN = 1024;
export const PLUGIN_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;
export const SKILL_NAME_PATTERN = /^[a-z0-9-]+$/;
export const ALLOWED_FRONTMATTER_KEYS = new Set([
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
  "compatibility",
]);

export const PLUGINS_ROOT_REL = "plugins";
export const PLUGIN_MANIFEST_DIR = ".claude-plugin";
export const PLUGIN_MANIFEST_NAME = "plugin.json";
export const MARKETPLACE_MANIFEST_REL = ".claude-plugin/marketplace.json";
export const DEFAULT_BRANCH = "main";
export const GITHUB_HOST = "github.com";

/** Canonical GitHub slug for this marketplace (Pages + install URLs). */
export const CANONICAL_GITHUB_REPOSITORY = "systembugtj/linglong-marketplace";

/** Former owners — never emit these in catalog or install scripts. */
export const DEPRECATED_GITHUB_REPOSITORIES = new Set([
  "luban-ws/linglong-marketplace",
]);
