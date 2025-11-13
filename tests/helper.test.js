// tests/helpers.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs";

// Mock fs
vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

describe("Helper Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("readExistingData", () => {
    const readExistingData = (filePath) => {
      try {
        if (fs.existsSync(filePath)) {
          return JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
      } catch (error) {
        console.error(`Error reading file: ${error.message}`);
      }
      return [];
    };

    it("should read and parse existing JSON file", () => {
      const mockData = [{ name: "Test", phone: "123" }];
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

      const result = readExistingData("test.json");
      expect(result).toEqual(mockData);
    });

    it("should return empty array if file does not exist", () => {
      fs.existsSync.mockReturnValue(false);

      const result = readExistingData("nonexistent.json");
      expect(result).toEqual([]);
    });

    it("should handle JSON parse errors", () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue("invalid json");
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = readExistingData("corrupt.json");
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("mergeAndDeduplicateData", () => {
    const mergeAndDeduplicateData = (existingData, newData) => {
      const uniqueMap = new Map();
      [...existingData, ...newData].forEach((business) => {
        if (business.maps_link && !uniqueMap.has(business.maps_link)) {
          uniqueMap.set(business.maps_link, business);
        }
      });
      return Array.from(uniqueMap.values());
    };

    it("should merge existing and new data", () => {
      const existing = [{ name: "A", maps_link: "https://maps.google.com/a" }];
      const newData = [{ name: "B", maps_link: "https://maps.google.com/b" }];

      const result = mergeAndDeduplicateData(existing, newData);
      expect(result).toHaveLength(2);
    });

    it("should remove duplicates based on maps_link", () => {
      const existing = [
        { name: "A", maps_link: "https://maps.google.com/same" },
      ];
      const newData = [
        { name: "B", maps_link: "https://maps.google.com/same" },
      ];

      const result = mergeAndDeduplicateData(existing, newData);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("A"); // First occurrence is kept
    });

    it("should filter out entries without maps_link", () => {
      const data = [
        { name: "A", maps_link: "https://maps.google.com/a" },
        { name: "B", maps_link: null },
        { name: "C" }, // No maps_link property
      ];

      const result = mergeAndDeduplicateData(data, []);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("A");
    });
  });
});
