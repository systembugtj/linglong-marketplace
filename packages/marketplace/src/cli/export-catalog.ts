#!/usr/bin/env node
import path from "node:path";

import { writePublicCatalog } from "../exportCatalog.js";
import { repoRoot } from "../repoRoot.js";
import {
  resolveRepositorySlug,
  resolveSourceBranch,
} from "../siteUrls.js";

const root = repoRoot();
const publicDir = path.join(root, "site", "public");
const repo = resolveRepositorySlug(root);
const branch = resolveSourceBranch(root);

writePublicCatalog(root, publicDir, { repo, branch });
console.log(`Wrote catalog to ${publicDir}`);
