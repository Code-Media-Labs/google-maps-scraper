/**
 * @jest-environment node
 */
import { jest } from "@jest/globals";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const mockEvaluate = jest.fn((fn) => {
  const code = fn.toString();

  if (code.includes("feed.scrollHeight")) {
    return Promise.resolve(200);
  }

  if (code.includes("feed.scrollBy")) {
    return Promise.resolve();
  }

  if (code.includes("Nv2PK")) {
    return Promise.resolve([
      {
        name: "Test Business",
        rating: "4.5",
        reviews_count: "100",
        phone: "9999999999",
        maps_link: "http://maps.test",
      },
    ]);
  }

  return Promise.resolve();
});

const mockPage = {
  setUserAgent: jest.fn(),
  setViewport: jest.fn(),
  goto: jest.fn(),
  waitForSelector: jest.fn(),
  click: jest.fn(),
  type: jest.fn(),
  keyboard: { press: jest.fn() },
  evaluate: mockEvaluate,
};

const mockBrowser = {
  newPage: jest.fn().mockResolvedValue(mockPage),
  close: jest.fn(),
};

jest.unstable_mockModule("puppeteer", () => ({
  default: {
    launch: jest.fn().mockResolvedValue(mockBrowser),
  },
}));

const { scrapeGoogleMaps } = await import("../src/scraper.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonOut = path.join(__dirname, "scraper-test.json");
const xlsxOut = path.join(__dirname, "scraper-test.xlsx");

describe("scrapeGoogleMaps", () => {
  afterAll(() => {
    if (fs.existsSync(jsonOut)) fs.unlinkSync(jsonOut);
    if (fs.existsSync(xlsxOut)) fs.unlinkSync(xlsxOut);
  });

  test("returns merged scraped data", async () => {
    const results = await scrapeGoogleMaps({
      searchQuery: "test",
      outputPath: jsonOut,
      headless: true,
      maxScrollAttempts: 2,
    });

    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Test Business");
    expect(fs.existsSync(jsonOut)).toBe(true);
    expect(fs.existsSync(xlsxOut)).toBe(true);
  }, 10000);
});
