#!/usr/bin/env node
import { runCatalogCli } from "./run.js";

process.exit(runCatalogCli(process.argv.slice(2)));
