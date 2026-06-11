export const CLI_NAME = "ll-skills";
export const PACKAGE_NAME = "@linglongjs/skill-validator";
export const VERSION = "0.1.0";

export type CliOptions = {
  help: boolean;
  version: boolean;
  path: string | null;
};

export function parseCliArgs(argv: string[]): CliOptions {
  let help = false;
  let version = false;
  let path: string | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      help = true;
      continue;
    }
    if (arg === "--version" || arg === "-V") {
      version = true;
      continue;
    }
    if (arg === "--path" || arg === "-p") {
      const next = argv[i + 1];
      if (!next || next.startsWith("-")) {
        throw new Error("missing value for --path");
      }
      path = next;
      i += 1;
      continue;
    }
    if (arg.startsWith("-")) {
      throw new Error(`unknown option: ${arg}`);
    }
    if (path !== null) {
      throw new Error(`unexpected argument: ${arg}`);
    }
    path = arg;
  }

  return { help, version, path };
}

export function formatHelp(): string {
  return `ll-skills — validate Claude Code SKILL.md and marketplace layout

Usage:
  ll-skills                 validate nearest marketplace (walks up from cwd)
  ll-skills <path>          validate marketplace at path
  ll-skills -p <path>       same as above

Options:
  -h, --help                show this help
  -V, --version             show version
  -p, --path <dir>          marketplace repo root

Examples:
  npx ${PACKAGE_NAME}
  pnpm dlx ${PACKAGE_NAME}
  ll-skills
  ll-skills .
  ll-skills plugins/tauri-plugin
`;
}
