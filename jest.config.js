/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = {
	preset: "jest-puppeteer",
	testEnvironment: "./test/jest-puppeteer-environment.js",
	globals: {
		PATH: `http://localhost:7575`,
	},
	reporters: ["default", "jest-junit"],
	verbose: true,
};
