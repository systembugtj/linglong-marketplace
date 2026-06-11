import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const repo = process.env.GITHUB_REPOSITORY ?? "";
const defaultBase = repo.includes("/") ? `/${repo.split("/")[1]}/` : "/";

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || defaultBase,
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
