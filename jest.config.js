/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// Get the test port from the global map and set it in env for this test
const { name } = require("./package.json");

module.exports = {
  preset: "jest-puppeteer",
  globals: {
    PATH: "http://localhost:8081",
    "ts-jest": {
        diagnostics: {
          ignoreCodes: [7016] // ignores tsconfig `"strict": true`
        }
      }
  },
  testMatch: ["**/?(*.)+(spec|test).[t]s"],
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
};
