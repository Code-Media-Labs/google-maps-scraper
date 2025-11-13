#!/usr/bin/env node

// Suppress Node experimental warnings & Puppeteer warnings
process.env.NODE_NO_WARNINGS = "1";

import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { scrapeGoogleMaps } from "../src/scraper.js";

const program = new Command();

program
  .name("gmaps-scraper")
  .description(
    chalk.cyan(
      "A powerful Google Maps scraping tool to extract business listings (name, rating, reviews, phone, Maps URL) and export results as JSON + Excel."
    )
  )
  .version("1.0.0", "-v, --version", "Show the current version");

program
  .command("scrape")
  .description(
    "Scrape Google Maps for business listings based on a search query"
  )
  .requiredOption(
    "-q, --query <query>",
    chalk.white(
      'Search keyword or phrase (e.g., "Interior Designers in Bhubaneswar")'
    )
  )
  .option(
    "-o, --output <path>",
    chalk.white(
      "Output JSON file path (Excel file is generated automatically)"
    ),
    "results.json"
  )
  .option(
    "-m, --max-scrolls <number>",
    chalk.white("Maximum scroll attempts to load more Google Maps results"),
    "100"
  )
  .option(
    "--headless",
    chalk.white("Run Puppeteer in headless mode for improved performance"),
    false
  )
  .action(async (options) => {
    const maxScrolls = parseInt(options.maxScrolls);
    if (isNaN(maxScrolls) || maxScrolls <= 0) {
      console.error(
        chalk.red(
          "\n✖ Invalid value for --max-scrolls. Must be a positive number.\n"
        )
      );
      process.exit(1);
    }

    console.log(chalk.bold.cyan("\n🔍 Google Maps Scraper"));
    console.log(chalk.gray("───────────────────────────────────────────────"));
    console.log(chalk.white(`Query:          ${options.query}`));
    console.log(chalk.white(`Output File:     ${options.output}`));
    console.log(chalk.white(`Scroll Attempts: ${maxScrolls}`));
    console.log(
      chalk.white(`Headless Mode:   ${options.headless ? "Yes" : "No"}`)
    );
    console.log(
      chalk.gray("───────────────────────────────────────────────\n")
    );

    const spinner = ora("Launching scraper…").start();

    try {
      const results = await scrapeGoogleMaps({
        searchQuery: options.query,
        outputPath: options.output,
        maxScrollAttempts: maxScrolls,
        headless: options.headless,
      });

      spinner.succeed(chalk.green("Scraping completed successfully."));

      console.log(chalk.bold.green("\n✔ Summary"));
      console.log(
        chalk.gray("───────────────────────────────────────────────")
      );
      console.log(chalk.white(`Businesses scraped: ${results.length}`));
      console.log(chalk.white(`JSON saved to:       ${options.output}`));
      console.log(
        chalk.white(
          `Excel saved to:      ${options.output.replace(".json", ".xlsx")}`
        )
      );
      console.log(
        chalk.gray("───────────────────────────────────────────────")
      );
      console.log(chalk.blue("\nReady to go! 🚀\n"));
    } catch (error) {
      spinner.fail(chalk.red("Scraping failed unexpectedly."));
      console.error(chalk.red("\n✖ Error Message:"));
      console.error(chalk.white(error.message));
      console.log();
      process.exit(1);
    }
  });

// Display help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse();
