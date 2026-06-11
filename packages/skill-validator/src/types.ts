export type MarketplacePluginEntry = {
  name?: string;
  description?: string;
  source?: string;
  strict?: boolean;
  skills?: string[];
};

export type MarketplaceManifest = {
  name?: string;
  metadata?: { description?: string; version?: string };
  plugins?: MarketplacePluginEntry[];
};
