# @cml/google-maps-scraper

_This project is currently in an alpha version, and active development work is ongoing._

A powerful **Node.js CLI tool and JavaScript library** for scraping **Google Maps business listings** using Puppeteer — with automatic JSON + Excel (XLSX) export.

Built and maintained by **[Code Media Labs](http://codemedialabs.in)**.

<p align="left">
  <img src="https://img.shields.io/npm/v/@cml/google-maps-scraper" alt="NPM Version" />
  <img src="https://img.shields.io/badge/coverage-81%25-yellowgreen" alt="Coverage" />
  <img src="https://img.shields.io/npm/dm/@cml/google-maps-scraper" alt="NPM Downloads" />
  <img src="https://img.shields.io/github/stars/Code-Media-Labs/google-maps-scraper" alt="GitHub Stars" />
  <img src="https://img.shields.io/github/issues/Code-Media-Labs/google-maps-scraper" alt="GitHub Issues" />
  <img src="https://img.shields.io/github/license/Code-Media-Labs/google-maps-scraper" alt="License: MIT" />
  <img src="https://img.shields.io/badge/Node-%3E%3D18.0.0-green" alt="Node Version" />
</p>

## ✨ Features

- 🔍 Scrapes Google Maps business listings for any search query
- 📄 Extracts:
  - Business name
  - Rating
  - Total reviews
  - Phone number
  - Google Maps URL
- 🔁 Auto-scroll until no more results
- 🛡️ Deduplicates entries by `maps_link`
- 📦 Outputs:
  - `results.json`
  - `results.xlsx` (beautifully formatted with ExcelJS)
- 🧰 Usable as:
  - ✔ CLI tool
  - ✔ Importable NPM library

---

## 📦 Installation

### **Global (CLI usage)**

```bash
npm install -g @cml/google-maps-scraper
```

### Local (as a library)

```bash
npm install @cml/google-maps-scraper
```

## CLI Usage

```bash
gmaps-scraper scrape -q "<your search query>" [options]
```

Example:

```bash
gmaps-scraper scrape -q "Interior Designers in Bhubaneswar"
```

Options
| Flag | Description | Default |
|--|--|--
| -q, --query | Google Maps search query | required |
|-o, --output| Output JSON file path | results.json |
|-m, --max-scrolls| Maximum scroll attempts |100 |
|--headless|Run Puppeteer in headless mode |false |

## Library Usage (Node.js)

```js
import { scrapeGoogleMaps } from "@cml/google-maps-scraper";

const results = await scrapeGoogleMaps({
  searchQuery: "Cafes in Cuttack",
  outputPath: "cafes.json",
  maxScrollAttempts: 80,
  headless: true,
});

console.log(results);
```

### Output Example

```json
[
  {
    "name": "Urban Café",
    "rating": "4.5",
    "reviews_count": "1,204",
    "phone": "+91 9876543210",
    "maps_link": "https://www.google.com/maps/place/..."
  }
]
```

### Running Tests

```bash
npm test
```

## Development

**Clone the repo:**

```bash
git clone https://github.com/Code-Media-Labs/google-maps-scraper.git
cd google-maps-scraper
npm install
```

**Run the CLI locally:**

```bash
node ./bin/gmaps-scraper.js scrape -q "Hotels in Puri"
```

## Contributing

Issues and PRs are welcome!
Visit:
https://github.com/Code-Media-Labs/google-maps-scraper/issues

## License

MIT © Code Media Labs
