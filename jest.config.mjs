export default {
  testEnvironment: "node",
  transform: {},

  // Let Jest recognize .mjs test files
  moduleFileExtensions: ["js", "mjs", "json"],

  roots: ["<rootDir>/tests"],

  testMatch: ["**/*.test.mjs"],

  maxWorkers: 1,
  verbose: true,
};
