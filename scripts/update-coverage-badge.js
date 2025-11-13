import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read coverage file
const coveragePath = path.join(__dirname, "../coverage/coverage-final.json");
const coverageData = JSON.parse(readFileSync(coveragePath, "utf8"));

// Calculate total coverage across all files
let totalStatements = 0;
let coveredStatements = 0;
let totalBranches = 0;
let coveredBranches = 0;
let totalFunctions = 0;
let coveredFunctions = 0;
let totalLines = 0;
let coveredLines = 0;

Object.values(coverageData).forEach((file) => {
  // Count statements
  const statements = Object.values(file.s);
  totalStatements += statements.length;
  coveredStatements += statements.filter((count) => count > 0).length;

  // Count branches
  const branches = Object.values(file.b).flat();
  totalBranches += branches.length;
  coveredBranches += branches.filter((count) => count > 0).length;

  // Count functions
  const functions = Object.values(file.f);
  totalFunctions += functions.length;
  coveredFunctions += functions.filter((count) => count > 0).length;

  // Count lines (using statement map as proxy)
  const lines = Object.keys(file.statementMap).length;
  totalLines += lines;
  coveredLines += Object.values(file.s).filter((count) => count > 0).length;
});

// Calculate percentages
const statementCoverage = Math.round(
  (coveredStatements / totalStatements) * 100
);
const branchCoverage = Math.round((coveredBranches / totalBranches) * 100);
const functionCoverage = Math.round((coveredFunctions / totalFunctions) * 100);
const lineCoverage = Math.round((coveredLines / totalLines) * 100);

// Use line coverage as the main metric (most common)
const percentage = lineCoverage;

console.log("\n📊 Coverage Summary:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`Lines:      ${lineCoverage}% (${coveredLines}/${totalLines})`);
console.log(
  `Statements: ${statementCoverage}% (${coveredStatements}/${totalStatements})`
);
console.log(
  `Branches:   ${branchCoverage}% (${coveredBranches}/${totalBranches})`
);
console.log(
  `Functions:  ${functionCoverage}% (${coveredFunctions}/${totalFunctions})`
);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// Determine color based on line coverage
let color = "red";
if (percentage >= 95) color = "brightgreen";
else if (percentage >= 90) color = "green";
else if (percentage >= 75) color = "yellowgreen";
else if (percentage >= 60) color = "yellow";
else if (percentage >= 40) color = "orange";

// Create badge URL
const badgeUrl = `https://img.shields.io/badge/coverage-${percentage}%25-${color}`;

console.log(`✅ Coverage: ${percentage}%`);
console.log(`🎨 Color: ${color}`);
console.log(`🔗 Badge URL: ${badgeUrl}\n`);

// Update README
const readmePath = path.join(__dirname, "../README.md");
let readme = readFileSync(readmePath, "utf8");

// Replace old badge with new one (or add if doesn't exist)
const badgeRegex = /https:\/\/img\.shields\.io\/badge\/coverage-\d+%25-\w+/;

if (badgeRegex.test(readme)) {
  readme = readme.replace(badgeRegex, badgeUrl);
  console.log("✏️  Updated existing coverage badge in README.md");
} else {
  // If badge doesn't exist, add it after npm version badge
  const npmBadgeRegex =
    /(img src="https:\/\/img\.shields\.io\/npm\/v\/@cml\/google-maps-scraper"[^>]+>)/;
  if (npmBadgeRegex.test(readme)) {
    readme = readme.replace(
      npmBadgeRegex,
      `$1\n  <img src="${badgeUrl}" alt="Coverage" />`
    );
    console.log("➕ Added new coverage badge to README.md");
  } else {
    console.warn("⚠️  Could not find npm badge to insert coverage badge after");
  }
}

writeFileSync(readmePath, readme);
console.log("✨ README.md updated successfully!\n");
