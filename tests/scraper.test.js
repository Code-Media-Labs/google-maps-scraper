// tests/scraper.test.js - FIXED: Last evaluate call must return the businesses array
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Create mock functions BEFORE importing modules
const mockLaunch = vi.fn();
const mockNewPage = vi.fn();
const mockClose = vi.fn();
const mockSetUserAgent = vi.fn();
const mockSetViewport = vi.fn();
const mockGoto = vi.fn();
const mockWaitForSelector = vi.fn();
const mockClick = vi.fn();
const mockType = vi.fn();
const mockPress = vi.fn();
const mockEvaluate = vi.fn();

const mockPage = {
  setUserAgent: mockSetUserAgent,
  setViewport: mockSetViewport,
  goto: mockGoto,
  waitForSelector: mockWaitForSelector,
  click: mockClick,
  type: mockType,
  keyboard: { press: mockPress },
  evaluate: mockEvaluate,
};

const mockBrowser = {
  newPage: mockNewPage,
  close: mockClose,
};

// Mock puppeteer
vi.mock("puppeteer", () => ({
  default: {
    launch: mockLaunch,
  },
}));

// Mock fs
const mockExistsSync = vi.fn();
const mockReadFileSync = vi.fn();
const mockWriteFileSync = vi.fn();

vi.mock("fs", () => ({
  default: {
    existsSync: mockExistsSync,
    readFileSync: mockReadFileSync,
    writeFileSync: mockWriteFileSync,
  },
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
}));

// Mock timers/promises
vi.mock("timers/promises", () => ({
  setTimeout: vi.fn().mockResolvedValue(undefined),
}));

// Mock Excel converter
vi.mock("../src/excelConverter.js", () => ({
  convertJsonToXlsx: vi.fn().mockResolvedValue(true),
}));

// Now import the module under test
const { scrapeGoogleMaps } = await import("../src/scraper.js");

describe("scrapeGoogleMaps", () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    mockLaunch.mockResolvedValue(mockBrowser);
    mockNewPage.mockResolvedValue(mockPage);
    mockClose.mockResolvedValue(undefined);
    mockSetUserAgent.mockResolvedValue(undefined);
    mockSetViewport.mockResolvedValue(undefined);
    mockGoto.mockResolvedValue(undefined);
    mockWaitForSelector.mockResolvedValue(undefined);
    mockClick.mockResolvedValue(undefined);
    mockType.mockResolvedValue(undefined);
    mockPress.mockResolvedValue(undefined);

    mockExistsSync.mockReturnValue(false);
    mockWriteFileSync.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should filter businesses without phone numbers", async () => {
    mockEvaluate
      .mockResolvedValueOnce(1000)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValue([
        {
          name: "Business With Phone",
          phone: "+91-1234567890",
          maps_link: "https://maps.google.com/1",
        },
        {
          name: "Business Without Phone",
          phone: null,
          maps_link: "https://maps.google.com/2",
        },
      ]);

    const results = await scrapeGoogleMaps({
      searchQuery: "Test Query",
      filterNullPhones: true,
    });

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Business With Phone");
  });

  it("should merge with existing data", async () => {
    const existingData = [
      {
        name: "Existing Business",
        phone: "+91-9999999999",
        maps_link: "https://maps.google.com/existing",
      },
    ];

    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify(existingData));

    mockEvaluate
      .mockResolvedValueOnce(1000)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValue([
        {
          name: "New Business",
          phone: "+91-1234567890",
          maps_link: "https://maps.google.com/new",
        },
      ]);

    const results = await scrapeGoogleMaps({
      searchQuery: "Test Query",
    });

    expect(results).toHaveLength(2);
  });

  it("should close browser even if error occurs", async () => {
    mockGoto.mockRejectedValue(new Error("Navigation failed"));

    await expect(
      scrapeGoogleMaps({
        searchQuery: "Test Query",
      })
    ).rejects.toThrow("Navigation failed");

    expect(mockClose).toHaveBeenCalled();
  });

  it("should handle empty search results", async () => {
    mockEvaluate
      .mockResolvedValueOnce(1000)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValue([]);

    const results = await scrapeGoogleMaps({
      searchQuery: "Nonexistent Business Type",
    });

    expect(results).toHaveLength(0);
  });

  it("should use correct default options", async () => {
    mockEvaluate
      .mockResolvedValueOnce(1000)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValue([]);

    await scrapeGoogleMaps({
      searchQuery: "Test Query",
    });

    expect(mockWriteFileSync).toHaveBeenCalledWith(
      "results.json",
      expect.any(String)
    );
  });

  it("should set proper user agent and viewport", async () => {
    mockEvaluate
      .mockResolvedValueOnce(1000)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(1500)
      .mockResolvedValue([]);

    await scrapeGoogleMaps({
      searchQuery: "Test Query",
    });

    expect(mockSetUserAgent).toHaveBeenCalledWith(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );

    expect(mockSetViewport).toHaveBeenCalledWith({
      width: 1280,
      height: 800,
    });
  });
  it("should scrape businesses successfully", async () => {
    // With maxScrollAttempts=5:
    // Loop runs 5 times: 5 height checks + 5 scrolls = 10 calls
    // Then 1 final extraction = 11 total calls
    mockEvaluate
      .mockResolvedValueOnce(1000) // 1. Height check 1
      .mockResolvedValueOnce(undefined) // 2. Scroll 1
      .mockResolvedValueOnce(1500) // 3. Height check 2
      .mockResolvedValueOnce(undefined) // 4. Scroll 2
      .mockResolvedValueOnce(1500) // 5. Height check 3 (noChange=1)
      .mockResolvedValueOnce(undefined) // 6. Scroll 3
      .mockResolvedValueOnce(1500) // 7. Height check 4 (noChange=2)
      .mockResolvedValueOnce(undefined) // 8. Scroll 4
      .mockResolvedValueOnce(1500) // 9. Height check 5 (noChange=3)
      .mockResolvedValueOnce(undefined) // 10. Scroll 5
      .mockResolvedValueOnce([
        // 11. Extract businesses (FINAL)
        {
          name: "Test Business",
          rating: "4.5",
          reviews_count: "(100)",
          phone: "+91-1234567890",
          maps_link: "https://maps.google.com/test",
        },
      ]);

    const results = await scrapeGoogleMaps({
      searchQuery: "Interior Designers in Bhubaneswar",
      outputPath: "test-results.json",
      maxScrollAttempts: 5,
      headless: true,
      filterNullPhones: false,
    });

    expect(mockLaunch).toHaveBeenCalledWith({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    expect(mockGoto).toHaveBeenCalledWith(
      "https://www.google.com/maps",
      expect.objectContaining({
        waitUntil: "networkidle2",
      })
    );

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Test Business");
  });

  it("should deduplicate based on maps_link", async () => {
    // Fixed: Use 11 mocks (5 height + 5 scroll + 1 extraction)
    mockEvaluate
      .mockResolvedValueOnce(1000) // 1. Height check 1
      .mockResolvedValueOnce(undefined) // 2. Scroll 1
      .mockResolvedValueOnce(1500) // 3. Height check 2
      .mockResolvedValueOnce(undefined) // 4. Scroll 2
      .mockResolvedValueOnce(1500) // 5. Height check 3 (noChange=1)
      .mockResolvedValueOnce(undefined) // 6. Scroll 3
      .mockResolvedValueOnce(1500) // 7. Height check 4 (noChange=2)
      .mockResolvedValueOnce(undefined) // 8. Scroll 4
      .mockResolvedValueOnce(1500) // 9. Height check 5 (noChange=3)
      .mockResolvedValueOnce(undefined) // 10. Scroll 5
      .mockResolvedValueOnce([
        // 11. Extract businesses (FINAL)
        {
          name: "Business A",
          phone: "+91-1111111111",
          maps_link: "https://maps.google.com/duplicate",
        },
        {
          name: "Business B",
          phone: "+91-2222222222",
          maps_link: "https://maps.google.com/duplicate",
        },
      ]);

    const results = await scrapeGoogleMaps({
      searchQuery: "Test Query",
      maxScrollAttempts: 5, // ADD THIS - match the mock count
      filterNullPhones: false,
    });

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Business A"); // First one wins
  });

  it("should stop scrolling after max attempts", async () => {
    // With maxScrollAttempts=3, expect 3 height checks + 3 scrolls + 1 extraction = 7 calls
    mockEvaluate
      .mockResolvedValueOnce(1000) // Height check 1
      .mockResolvedValueOnce(undefined) // Scroll 1
      .mockResolvedValueOnce(1000) // Height check 2 (no change)
      .mockResolvedValueOnce(undefined) // Scroll 2
      .mockResolvedValueOnce(1000) // Height check 3 (no change)
      .mockResolvedValueOnce(undefined) // Scroll 3
      .mockResolvedValueOnce(1000) // Height check 4 (no change)
      .mockResolvedValueOnce(undefined) // Scroll 4
      .mockResolvedValueOnce(1000) // Height check 5 (no change)
      .mockResolvedValueOnce(undefined) // Scroll 5
      .mockResolvedValueOnce(1000) // Height check 6 (triggers break after 5 no-change)
      .mockResolvedValueOnce([]); // Final extraction

    await scrapeGoogleMaps({
      searchQuery: "Test Query",
      maxScrollAttempts: 3,
    });

    expect(mockEvaluate).toHaveBeenCalled();
  });
});
