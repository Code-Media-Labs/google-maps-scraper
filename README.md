# @cml/google-maps-scraper

_This project is currently in alpha and under active development._

A powerful **Node.js CLI tool and JavaScript library** for scraping **Google Maps business listings** using Puppeteer — with automatic JSON + Excel (XLSX) export. Built and maintained by **[Code Media Labs](https://codemedialabs.in)**.

<p align="left"> <img src="https://img.shields.io/npm/v/gmaps-scraper" /> <img src="https://img.shields.io/badge/coverage-81%25-yellowgreen" /> <img src="https://img.shields.io/npm/dm/gmaps-scraper" /> <img src="https://img.shields.io/github/stars/Code-Media-Labs/google-maps-scraper" /> <img src="https://img.shields.io/github/issues/Code-Media-Labs/google-maps-scraper" /> <img src="https://img.shields.io/github/license/Code-Media-Labs/google-maps-scraper" /> <img src="https://img.shields.io/badge/Node-%3E%3D18.0.0-green" /> </p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [CLI Usage](#-cli-usage)
- [Library Usage](#-library-usage-nodejs)
- [Examples](#-examples)
- [Troubleshooting](#-troubleshooting)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## Features

- 🔍 Scrapes Google Maps business listings for any search query
- 📊 Extracts detailed business data:
  - Name
  - Star rating
  - Total reviews
  - Phone number
  - Google Maps URL

- 🔁 Automatically scrolls until no new results are found
- 🛡️ Deduplicates entries by Maps URL
- 📦 Multiple output formats:
  - `results.json`
  - `results.xlsx` (ExcelJS)

- 🧰 Flexible usage:
  - CLI tool
  - Importable NPM library

- ⚡ Configurable scroll limits and headless mode
- 🎯 Great for lead generation, market research, competitor analysis

---

## Prerequisites

### Required

- **Node.js ≥ 18**
- **npm** or **yarn**

Check versions:

```bash
node --version
npm --version
```

### Linux / WSL Users

Install Chromium dependencies:

```bash
sudo apt-get update
sudo apt-get install -y \
ca-certificates fonts-liberation libappindicator3-1 libasound2 \
libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 \
libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
lsb-release wget xdg-utils`
```

Check missing libraries:

`ldd $(which chromium-browser) | grep not`

### Puppeteer & Chromium

Puppeteer automatically downloads a compatible Chromium build (≈ 170–280MB).  
No configuration required for most users.

---

## Installation

### Global (for CLI)

`npm install -g @cml/google-maps-scraper`

Check version:

`gmaps-scraper --version`

### Local (for library use)

`npm install @cml/google-maps-scraper`

---

## CLI Usage

### Basic Command

```bash
gmaps-scraper scrape -q "<your search query>"`
```

### Example

```bash
gmaps-scraper scrape -q "Interior Designers in Bhubaneswar"
```

### CLI Options

| Flag                | Description                    | Default        | Required |
| ------------------- | ------------------------------ | -------------- | -------- |
| `-q, --query`       | Google Maps search query       | —              | ✅ Yes   |
| `-o, --output`      | Output JSON file path          | `results.json` | No       |
| `-m, --max-scrolls` | Maximum scroll attempts        | `100`          | No       |
| `--headless`        | Run Puppeteer in headless mode | `false`        | No       |

### Advanced Examples

Save to a custom file:

```bash
gmaps-scraper scrape -q "Restaurants in Cuttack" -o ./data/restaurants.json
```

Headless + limited scrolls:

```bash
gmaps-scraper scrape -q "Hotels in Puri" --headless -m 50
```

---

## Library Usage (Node.js)

### Basic Example

```js
import { scrapeGoogleMaps } from "@cml/google-maps-scraper";
const results = await scrapeGoogleMaps({
  searchQuery: "Cafes in Cuttack",
  outputPath: "cafes.json",
  maxScrollAttempts: 80,
  headless: true,
});
console.log(`Found ${results.length} cafes`);
console.log(results);
```

### TypeScript Example

```ts
import { scrapeGoogleMaps } from "@cml/google-maps-scraper";
interface Business {
  name: string;
  rating: string;
  reviews_count: string;
  phone: string;
  maps_link: string;
}
async function findBusinesses(query: string): Promise<Business[]> {
  return scrapeGoogleMaps({
    searchQuery: query,
    outputPath: `${query.replace(/\s+/g, "_")}.json`,
    maxScrollAttempts: 100,
    headless: true,
  });
}
const businesses = await findBusinesses("Gyms in Bhubaneswar");
console.log(businesses);
```

### API Options

| Parameter           | Type      | Description                    | Default          | Required |
| ------------------- | --------- | ------------------------------ | ---------------- | -------- |
| `searchQuery`       | `string`  | Google Maps search term        | —                | ✅ Yes   |
| `outputPath`        | `string`  | Output JSON file path          | `"results.json"` | No       |
| `maxScrollAttempts` | `number`  | Maximum scroll attempts        | `100`            | No       |
| `headless`          | `boolean` | Run Puppeteer in headless mode | `false`          | No       |

## Examples

### Market Research

```bash
gmaps-scraper scrape -q "Hair Salons in Bhubaneswar" -o salons.json -m 150
```

### Lead Generation

```bash
gmaps-scraper scrape -q "Manufacturing Companies in Cuttack" --headless
```

### Scrape Multiple Queries (Node.js)

```js
import { scrapeGoogleMaps } from "@cml/google-maps-scraper";
import fs from "fs/promises";
const queries = [
  "Bakeries in Puri",
  "Bookstores in Bhubaneswar",
  "Electronics Shops in Cuttack",
];
async function scrapeMultiple() {
  const allResults = [];
  for (const query of queries) {
    console.log(`Scraping: ${query}`);
    const results = await scrapeGoogleMaps({
      searchQuery: query,
      outputPath: `${query.replace(/\s+/g, "_")}.json`,
      maxScrollAttempts: 50,
      headless: true,
    });

    allResults.push({ query, count: results.length, businesses: results });
  }
  await fs.writeFile(
    "combined_results.json",
    JSON.stringify(allResults, null, 2)
  );
  console.log("✅ All queries completed!");
}
scrapeMultiple();
```

---

## 🔍 Troubleshooting

### 1. Missing TypeScript during build

```bash
npm install --save-dev typescript
```

### 2. Chromium fails to launch (Linux)

Install dependencies from the Prerequisites section.

### 3. No results found

- Check internet
- Check search query
- Increase `maxScrollAttempts`
- Disable headless mode

### 4. Browser crashes

- Reduce scroll limit
- Ensure 2GB+ free RAM
- Close other apps

### 5. Permission issues

```bash
sudo npm install -g @cml/google-maps-scraper
```

---

## 🛠️ Development

### Clone Repo

`git clone https://github.com/Code-Media-Labs/google-maps-scraper.git cd google-maps-scraper`

### Install Dependencies

`npm install`

### Run Locally

`node ./bin/gmaps-scraper.js scrape -q "Hotels in Puri"`

### Build

`npm run build`

### Test

`npm test`

### Project Structure

google-maps-scraper/
├── bin/
│ └── gmaps-scraper.js
├── src/
│ ├── scraper.js
│ ├── excelConverter.js
│ └── index.js
├── tests/
│ └── scraper.test.js
│ └── excelConverter.test.js
├── package.json
├── vitest.config.js
└── README.md

---

## 🤝 Contributing

1.  Fork the repo
2.  Create a branch:

`git checkout -b feature/amazing-feature`

3.  Commit:

`git commit -m "feat: add amazing feature"`

4.  Push:

`git push origin feature/amazing-feature`

5.  Open a Pull Request

### Commit Types

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `refactor:` internal code
- `test:` tests
- `chore:` maintenance

---

## 📄 License

MIT © [Code Media Labs](https://codemedialabs.in)

---

## 🌟 Support

If you find this tool helpful:

- ⭐ Star the repo
- 🐛 Report issues
- 💡 Suggest features
- 🤝 Contribute
