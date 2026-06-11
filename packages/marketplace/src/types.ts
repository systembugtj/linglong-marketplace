import type {
  MarketplaceManifest,
  MarketplacePluginEntry,
} from "@linglongjs/skill-validator";

export type { MarketplaceManifest, MarketplacePluginEntry };

export type CatalogSkill = {
  id: string;
  folder: string;
  path: string;
  description: string;
  folderUrl: string;
  copyCommand: string;
  search: string;
};

export type CatalogPluginRow = {
  name: string;
  description: string;
  skillCount: number;
};

export type SiteCatalog = {
  marketTitle: string;
  metaDescription: string;
  version: string | null;
  generatedAt: string;
  repository: string;
  sourceBranch: string;
  cloneUrl: string;
  repoName: string;
  marketplaceName: string;
  pagesUrl: string;
  pagesCatalogUrl: string;
  pagesManifestUrl: string;
  marketplaceManifestRawUrl: string;
  repositoryUrl: string;
  installScriptRawUrl: string;
  installScriptPagesUrl: string;
  plugins: CatalogPluginRow[];
  skills: CatalogSkill[];
};
