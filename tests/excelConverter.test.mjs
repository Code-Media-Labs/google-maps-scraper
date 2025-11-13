/**
 * @jest-environment node
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ExcelJS from "exceljs";
import { convertJsonToXlsx } from "../src/excelConverter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "test-output.xlsx");

describe("convertJsonToXlsx", () => {
  const sampleData = [
    { name: "Test", phone: "123", rating: "4.5" },
    { name: "Another", phone: "999", rating: "4.0" },
  ];

  afterAll(() => {
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  });

  test("creates a valid XLSX file", async () => {
    const result = await convertJsonToXlsx(sampleData, outputPath);

    expect(result).toBe(true);
    expect(fs.existsSync(outputPath)).toBe(true);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(outputPath);

    const sheet = workbook.getWorksheet(1);

    expect(sheet.rowCount).toBe(3); // header + data rows
    expect(sheet.getCell("A1").value).toBe("Name");
  });
});
