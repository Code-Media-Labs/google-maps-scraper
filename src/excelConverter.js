// json-to-xlsx-exceljs-advanced.js

import ExcelJS from "exceljs";
/**
 * Advanced JSON to XLSX converter with styling using ExcelJS
 * @param {Array} jsonData - Array of JSON objects
 * @param {String} outputPath - Output file path
 * @param {Object} options - Configuration options
 */
export async function convertJsonToXlsx(jsonData, outputPath, options = {}) {
  try {
    const {
      sheetName = "Sheet1",
      headerStyle = true,
      autoWidth = true,
      freezeHeader = true,
      filterHeader = true,
    } = options;

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Code Media Labs";
    workbook.created = new Date();

    // Add a worksheet
    const worksheet = workbook.addWorksheet(sheetName);

    if (jsonData.length === 0) {
      throw new Error("JSON data is empty");
    }

    // Get headers from first object
    const headers = Object.keys(jsonData[0]);

    // Define columns with auto-width calculation
    worksheet.columns = headers.map((key) => {
      const maxLength = Math.max(
        key.length,
        ...jsonData.map((item) => {
          const value = item[key];
          return value ? value.toString().length : 0;
        })
      );

      return {
        header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
        key: key,
        width: autoWidth ? Math.min(maxLength + 5, 50) : 20,
      };
    });

    // Add rows
    jsonData.forEach((item) => {
      worksheet.addRow(item);
    });

    // Style the header row
    if (headerStyle) {
      const headerRow = worksheet.getRow(1);
      headerRow.font = {
        bold: true,
        size: 12,
        color: { argb: "FFFFFFFF" },
      };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
      };
      headerRow.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      headerRow.height = 25;
    }

    // Freeze the header row
    if (freezeHeader) {
      worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];
    }

    // Add auto-filter to header
    if (filterHeader) {
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: headers.length },
      };
    }

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Save to file
    await workbook.xlsx.writeFile(outputPath);

    console.log(`✓ Successfully converted JSON to XLSX: ${outputPath}`);
    console.log(`  - Rows: ${jsonData.length}`);
    console.log(`  - Columns: ${headers.length}`);
    return true;
  } catch (error) {
    console.error(`❌ Error converting JSON to XLSX: ${error.message}`);
    return false;
  }
}
