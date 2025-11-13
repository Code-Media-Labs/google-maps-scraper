// tests/setup.js
import { beforeAll, afterAll } from "vitest";
import fs from "fs";
import path from "path";

// Create test fixtures directory
const fixturesDir = path.join(process.cwd(), "tests", "fixtures");

beforeAll(() => {
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
});

afterAll(() => {
  // Clean up test fixtures
  if (fs.existsSync(fixturesDir)) {
    const files = fs.readdirSync(fixturesDir);
    files.forEach((file) => {
      fs.unlinkSync(path.join(fixturesDir, file));
    });
  }
});
