/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

const { existsSync } = require("node:fs");

const resolveExecutablePath = () => {
	if (process.env.PUPPETEER_EXECUTABLE_PATH !== undefined) {
		return process.env.PUPPETEER_EXECUTABLE_PATH;
	}

	const candidatesByPlatform = {
		darwin: ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"],
		linux: ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"],
		win32: [
			"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
			"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
		],
	};
	const candidates = candidatesByPlatform[process.platform] ?? [];
	const executablePath = candidates.find((path) => existsSync(path));
	if (executablePath !== undefined) {
		return executablePath;
	}

	if (process.env.PUPPETEER_SKIP_DOWNLOAD === "true") {
		throw new Error(
			"No Chrome executable found. Set PUPPETEER_EXECUTABLE_PATH to a valid browser path.",
		);
	}
};

module.exports = {
	server: {
		command: `npm run start:client -- --port=7575`,
		port: 7575,
		launchTimeout: 60000,
	},
	launch: {
		slowMo: 30, // slows down process for easier viewing
		headless: "new", // run in the browser; https://developer.chrome.com/articles/new-headless/
		executablePath: resolveExecutablePath(),
		args: ["--no-sandbox", "--disable-setuid-sandbox"], // https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
		dumpio: process.env.FLUID_TEST_VERBOSE !== undefined, // output browser console to cmd line
	},
};
