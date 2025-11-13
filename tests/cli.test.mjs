/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cli = path.resolve(__dirname, "../bin/gmaps-scraper.js");

// Utility to suppress Node warnings
const clean = (output) =>
  output
    .replace(/^\(node:.+\n?/gm, "")
    .replace(/ExperimentalWarning:.+\n?/gm, "");

describe("CLI: gmaps-scraper", () => {
  test("prints help", (done) => {
    exec(`node ${cli} --help`, (err, stdout) => {
      const out = clean(stdout);

      // match anything descriptive in help
      expect(out).toContain("A powerful Google Maps scraping tool");
      expect(out).toContain("Usage:");
      expect(out).toContain("scrape");

      done();
    });
  }, 10000);

  test("fails without query", (done) => {
    exec(`node ${cli} scrape`, (err, stdout, stderr) => {
      const errOut = clean(stderr);

      expect(errOut).toContain(
        "required option '-q, --query <query>' not specified"
      );

      done();
    });
  }, 10000);
});
