//scraper.js
import puppeteer from "puppeteer";
import fs from "fs";
import { setTimeout } from "timers/promises";
import { convertJsonToXlsx } from "./excelConverter.js";

export async function scrapeGoogleMaps(options = {}) {
  const {
    searchQuery,
    outputPath = "results.json",
    maxScrollAttempts = 100,
    headless = true,
    filterNullPhones = true,
  } = options;

  let browser;

  try {
    browser = await puppeteer.launch({
      headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate and search
    await page.goto("https://www.google.com/maps", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await setTimeout(3000);
    await page.waitForSelector("#searchboxinput", { visible: true });
    await page.click("#searchboxinput");
    await setTimeout(500);
    await page.type("#searchboxinput", searchQuery, { delay: 100 });
    await page.keyboard.press("Enter");
    await setTimeout(5000);
    await page.waitForSelector('div[role="feed"]', { timeout: 20000 });

    // Scroll to load results
    let previousHeight = 0;
    let scrollAttempts = 0;
    let noChangeCount = 0;

    while (scrollAttempts < maxScrollAttempts) {
      const currentHeight = await page.evaluate(() => {
        const feed = document.querySelector('div[role="feed"]');
        return feed ? feed.scrollHeight : 0;
      });

      await page.evaluate(() => {
        const feed = document.querySelector('div[role="feed"]');
        if (feed) feed.scrollBy(0, 1000);
      });

      await setTimeout(2000);

      if (currentHeight === previousHeight) {
        noChangeCount++;
        if (noChangeCount >= 5) break;
      } else {
        noChangeCount = 0;
      }

      previousHeight = currentHeight;
      scrollAttempts++;
    }

    // Extract business data
    const businesses = await page.evaluate(() => {
      const results = [];
      const businessCards = document.querySelectorAll("div.Nv2PK");

      businessCards.forEach((card) => {
        try {
          const linkElement = card.querySelector("a.hfpxzc");
          const nameElement = card.querySelector("div.qBF1Pd");
          const ratingElement = card.querySelector("span.MW4etd");
          const reviewElement = card.querySelector("span.UY7F9");
          const phoneElement = card.querySelector("span.UsdlK");

          const name = nameElement?.textContent.trim();
          const link = linkElement?.href;

          if (name && link) {
            results.push({
              name,
              rating: ratingElement?.textContent.trim(),
              reviews_count: reviewElement?.textContent.trim(),
              phone: phoneElement?.textContent.trim(),
              maps_link: link,
            });
          }
        } catch (error) {
          console.error("Error parsing card:", error);
        }
      });

      return results;
    });

    // Filter and save
    const existingData = readExistingData(outputPath);
    let mergedData = mergeAndDeduplicateData(existingData, businesses);

    if (filterNullPhones) {
      mergedData = mergedData.filter((b) => b.phone);
    }

    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));

    // Generate Excel
    const xlsxPath = outputPath.replace(".json", ".xlsx");
    await convertJsonToXlsx(mergedData, xlsxPath, {
      sheetName: searchQuery.substring(0, 30),
      headerStyle: true,
      autoWidth: true,
    });

    return mergedData;
  } finally {
    if (browser) await browser.close();
  }
}

// Helper functions
function readExistingData(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
  }
  return [];
}

function mergeAndDeduplicateData(existingData, newData) {
  const uniqueMap = new Map();

  // Defensive check: ensure both parameters are arrays
  const existing = Array.isArray(existingData) ? existingData : [];
  const incoming = Array.isArray(newData) ? newData : [];

  [...existing, ...incoming].forEach((business) => {
    if (business.maps_link && !uniqueMap.has(business.maps_link)) {
      uniqueMap.set(business.maps_link, business);
    }
  });

  return Array.from(uniqueMap.values());
}
