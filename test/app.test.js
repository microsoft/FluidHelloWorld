/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const config = require("../jest.config");

function getDieValueFromTextContent(textContent) {
	// Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
	return textContent.codePointAt(0) - 0x267f;
}

describe("fluid-hello-world", () => {
	let url;
	beforeAll(async () => {
		// Wait for the page to load first before running any tests
		// so this time isn't attributed to the first test
		await page.goto(config.globals.PATH, { waitUntil: "load", timeout: 0 });
	}, 45000);

	beforeEach(async () => {
		await page.goto(config.globals.PATH, { waitUntil: "load" });
		await page.waitForFunction(() => window["fluidStarted"]);
		url = page.url();
	});

	it("Load the container", async () => {
		await page.goto(url, { waitUntil: "domcontentloaded" });
	});

	/**
	 * create a container, update the dice value locally, reload url, validate value persisted
	 */
	it("roll and load the dice", async () => {
		await page.goto(url, { waitUntil: "domcontentloaded" });

		// get the dice value after first roll
		await page.waitForSelector(".dice");
		let element1 = await page.$(".dice");
		const initialValueString = await page.evaluate((el) => el.textContent, element1);
		const initialValue = getDieValueFromTextContent(initialValueString);

		// Validate if the initial dice value is equal to 1
		expect(initialValue).toEqual(1);

		const rollDice = async () => {
			// Validate there is a button that can be clicked
			await expect(page).toClick("button", { text: "Roll" });
			const valueString = await page.evaluate((el) => el.textContent, element1);
			return getDieValueFromTextContent(valueString);
		};

		// roll dice until value is not equal to 1
		let value1;
		do {
			value1 = await rollDice();
		} while (value1 === 1);

		// load the page again and check if the value matches with the first rolled value
		await page.goto(url, { waitUntil: "domcontentloaded" });
		await page.waitForSelector(".dice");
		let element2 = await page.$(".dice");
		const value2String = await page.evaluate((e2) => e2.textContent, element2);
		const value2 = getDieValueFromTextContent(value2String);

		expect(value1).toEqual(value2);
	});
});
