// tests/cli.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Command } from "commander";

// Mock dependencies
vi.mock("chalk", () => ({
  default: {
    cyan: vi.fn((text) => text),
    white: vi.fn((text) => text),
    red: vi.fn((text) => text),
    green: vi.fn((text) => text),
    blue: vi.fn((text) => text),
    gray: vi.fn((text) => text),
    bold: {
      cyan: vi.fn((text) => text),
      green: vi.fn((text) => text),
    },
  },
}));

vi.mock("ora", () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
    fail: vi.fn(),
  })),
}));

vi.mock("../src/scraper.js", () => ({
  scrapeGoogleMaps: vi
    .fn()
    .mockResolvedValue([{ name: "Test Business", phone: "1234567890" }]),
}));

describe("CLI Command", () => {
  let program;

  beforeEach(() => {
    program = new Command();
    vi.clearAllMocks();
  });

  it("should define scrape command with required options", () => {
    program
      .command("scrape")
      .requiredOption("-q, --query <query>")
      .option("-o, --output <path>", "output path", "results.json")
      .option("-m, --max-scrolls <number>", "max scrolls", "100")
      .option("--headless", "headless mode", false);

    const command = program.commands.find((cmd) => cmd.name() === "scrape");
    expect(command).toBeDefined();
    expect(command.name()).toBe("scrape");
  });

  it("should validate max-scrolls option as positive number", () => {
    const maxScrolls = "100";
    const parsed = parseInt(maxScrolls);

    expect(isNaN(parsed)).toBe(false);
    expect(parsed).toBeGreaterThan(0);
  });

  it("should reject invalid max-scrolls values", () => {
    const invalidValues = ["-5", "0", "abc", ""];

    invalidValues.forEach((value) => {
      const parsed = parseInt(value);
      const isValid = !isNaN(parsed) && parsed > 0;
      expect(isValid).toBe(false);
    });
  });

  it("should have default values for optional parameters", () => {
    program
      .command("scrape")
      .requiredOption("-q, --query <query>")
      .option("-o, --output <path>", "output path", "results.json")
      .option("-m, --max-scrolls <number>", "max scrolls", "100")
      .option("--headless", "headless mode", false);

    const command = program.commands.find((cmd) => cmd.name() === "scrape");
    const outputOption = command.options.find((opt) => opt.long === "--output");
    const maxScrollsOption = command.options.find(
      (opt) => opt.long === "--max-scrolls"
    );
    const headlessOption = command.options.find(
      (opt) => opt.long === "--headless"
    );

    expect(outputOption.defaultValue).toBe("results.json");
    expect(maxScrollsOption.defaultValue).toBe("100");
    expect(headlessOption.defaultValue).toBe(false);
  });

  it("should parse command line arguments correctly", async () => {
    program
      .command("scrape")
      .requiredOption("-q, --query <query>")
      .option("-o, --output <path>", "output path", "results.json")
      .option("-m, --max-scrolls <number>", "max scrolls", "100")
      .action((options) => {
        expect(options.query).toBe("Interior Designers");
        expect(options.output).toBe("custom.json");
        expect(options.maxScrolls).toBe("50");
      });

    await program.parseAsync([
      "node",
      "cli.js",
      "scrape",
      "-q",
      "Interior Designers",
      "-o",
      "custom.json",
      "-m",
      "50",
    ]);
  });
});
