#!/usr/bin/env node
import { runCli } from "./run.js";

process.exit(runCli(process.argv.slice(2)));
