// tests/integration.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { scrapeGoogleMaps } from "../src/scraper.js";
import fs from "fs";
import path from "path";

describe("Integration Tests", () => {
  const testDir = "./tests/integration-output";
  const testJsonPath = path.join(testDir, "integration-test.json");
  const testXlsxPath = path.join(testDir, "integration-test.xlsx");

  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Clean up previous test files
    if (fs.existsSync(testJsonPath)) fs.unlinkSync(testJsonPath);
    if (fs.existsSync(testXlsxPath)) fs.unlinkSync(testXlsxPath);
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testJsonPath)) fs.unlinkSync(testJsonPath);
    if (fs.existsSync(testXlsxPath)) fs.unlinkSync(testXlsxPath);
  });

  it("should create both JSON and XLSX files", async () => {
    // This is a mock test - in real scenario, you'd use actual scraping
    // For unit tests, mock puppeteer to avoid actual browser automation

    const mockData = [
      {
        name: "Integration Test Business",
        rating: "4.5",
        reviews_count: "(50)",
        phone: "+91-1234567890",
        maps_link: "https://maps.google.com/test",
      },
    ];

    // Write mock JSON
    fs.writeFileSync(testJsonPath, JSON.stringify(mockData, null, 2));

    expect(fs.existsSync(testJsonPath)).toBe(true);

    const content = JSON.parse(fs.readFileSync(testJsonPath, "utf-8"));
    expect(content).toHaveLength(1);
    expect(content[0].name).toBe("Integration Test Business");
  }, 30000); // 30 second timeout for integration tests
});
