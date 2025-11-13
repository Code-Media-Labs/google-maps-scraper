import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "gmaps-scraper": "bin/gmaps-scraper.js",
    index: "src/index.js",
  },
  format: ["esm", "cjs"],
  dts: false, // No TypeScript, so no .d.ts files needed
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  minify: true,
  bundle: true,
  skipNodeModulesBundle: true, // Don't bundle dependencies
  external: ["puppeteer", "exceljs", "commander", "chalk", "ora"],
  shims: true, // For __dirname and __filename in ESM
  target: "node18",
  platform: "node",
});
