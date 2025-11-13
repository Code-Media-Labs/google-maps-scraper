// tests/excelConverter.test.js - FIXED autoFilter test
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { convertJsonToXlsx } from "../src/excelConverter.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

describe("convertJsonToXlsx", () => {
  const testDir = "./tests/fixtures";
  const testOutputPath = path.join(testDir, "test-output.xlsx");
  const sampleData = [
    {
      name: "Business A",
      rating: "4.5",
      reviews_count: "(120)",
      phone: "+91-1234567890",
      maps_link: "https://maps.google.com/business-a",
    },
    {
      name: "Business B",
      rating: "4.2",
      reviews_count: "(85)",
      phone: "+91-9876543210",
      maps_link: "https://maps.google.com/business-b",
    },
  ];

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    if (fs.existsSync(testOutputPath)) {
      fs.unlinkSync(testOutputPath);
    }
  });

  afterEach(() => {
    if (fs.existsSync(testOutputPath)) {
      fs.unlinkSync(testOutputPath);
    }
  });

  it("should create xlsx file with correct data", async () => {
    const result = await convertJsonToXlsx(sampleData, testOutputPath);

    expect(result).toBe(true);
    expect(fs.existsSync(testOutputPath)).toBe(true);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testOutputPath);
    const worksheet = workbook.getWorksheet("Sheet1");

    expect(worksheet.rowCount).toBe(3);
    expect(worksheet.getRow(2).getCell(1).value).toBe("Business A");
  });

  it("should apply header styling correctly", async () => {
    await convertJsonToXlsx(sampleData, testOutputPath, { headerStyle: true });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testOutputPath);
    const worksheet = workbook.getWorksheet("Sheet1");
    const headerRow = worksheet.getRow(1);

    expect(headerRow.font.bold).toBe(true);
    expect(headerRow.font.color.argb).toBe("FFFFFFFF");
    expect(headerRow.fill.fgColor.argb).toBe("FF4472C4");
  });

  it("should handle custom sheet name", async () => {
    const customSheetName = "Custom Sheet";
    await convertJsonToXlsx(sampleData, testOutputPath, {
      sheetName: customSheetName,
    });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testOutputPath);
    const worksheet = workbook.getWorksheet(customSheetName);

    expect(worksheet).toBeDefined();
    expect(worksheet.name).toBe(customSheetName);
  });

  it("should freeze header row when enabled", async () => {
    await convertJsonToXlsx(sampleData, testOutputPath, { freezeHeader: true });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testOutputPath);
    const worksheet = workbook.getWorksheet("Sheet1");

    expect(worksheet.views[0].state).toBe("frozen");
    expect(worksheet.views[0].ySplit).toBe(1);
  });

  it("should add auto-filter when enabled", async () => {
    await convertJsonToXlsx(sampleData, testOutputPath, { filterHeader: true });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testOutputPath);
    const worksheet = workbook.getWorksheet("Sheet1");

    // ExcelJS stores autoFilter as a string like "A1:E1"
    expect(worksheet.autoFilter).toBeDefined();
    expect(typeof worksheet.autoFilter).toBe("string");
    expect(worksheet.autoFilter).toMatch(/^[A-Z]\d+:[A-Z]\d+$/); // Format: A1:E1
  });

  it("should handle empty data array", async () => {
    const result = await convertJsonToXlsx([], testOutputPath);

    expect(result).toBe(false);
  });

  it("should capitalize column headers", async () => {
    await convertJsonToXlsx(sampleData, testOutputPath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testOutputPath);
    const worksheet = workbook.getWorksheet("Sheet1");

    expect(worksheet.getRow(1).getCell(1).value).toBe("Name");
    expect(worksheet.getRow(1).getCell(2).value).toBe("Rating");
  });

  it("should set column widths based on content", async () => {
    await convertJsonToXlsx(sampleData, testOutputPath, { autoWidth: true });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testOutputPath);
    const worksheet = workbook.getWorksheet("Sheet1");

    expect(worksheet.getColumn(5).width).toBeGreaterThan(20);
  });

  it("should add borders to all cells", async () => {
    await convertJsonToXlsx(sampleData, testOutputPath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testOutputPath);
    const worksheet = workbook.getWorksheet("Sheet1");
    const cell = worksheet.getRow(2).getCell(1);

    expect(cell.border.top.style).toBe("thin");
    expect(cell.border.left.style).toBe("thin");
    expect(cell.border.bottom.style).toBe("thin");
    expect(cell.border.right.style).toBe("thin");
  });

  it("should handle file write errors", async () => {
    const invalidPath = "/invalid/path/that/does/not/exist/file.xlsx";

    const result = await convertJsonToXlsx(sampleData, invalidPath);

    expect(result).toBe(false);
  });
});
