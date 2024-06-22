/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const config = require("../jest.config");

let url;

describe("fluid-hello-world", () => {
	beforeAll(async () => {
		// Wait for the page to load first before running any tests
		// so this time isn't attributed to the first test
		await page.goto(config.globals.PATH, { waitUntil: "load", timeout: 0 });
	}, 60000);

	beforeEach(async () => {
		await page.goto(config.globals.PATH, { waitUntil: "load" });
		await page.waitForFunction(() => window["fluidStarted"]);
		url = await page.url();
	});

	it("Load the container", async () => {
		await page.goto(url, { waitUntil: "domcontentloaded" });
	});

	/**
	 * create a container, update the dice value locally, reload url, validate value persisted
	 */
	it("roll and load the dice", async () => {
		// get the dice element
		const diceElement = page.locator(".dice");
		let diceValue = await diceElement.map((Text) => Text.textContent.codePointAt(0)).wait();
		const val0 = diceValue - 0x267f;
		// Validate if the initial dice value is equal to 1
		expect(val0).toEqual(1);

		let val1;
		const rollDice = async () => {
			// get the roll button element
			const rollButton = page.locator("button", { text: "Roll" });

			// click the roll button
			await rollButton.click();
			diceValue = await diceElement.map((Text) => Text.textContent.codePointAt(0)).wait();
			// Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
			val1 = diceValue - 0x267f;
		};

		// roll dice until value has changed in a way we can easily confirm (i.e. when it is no longer equal to 1)
		do {
			await rollDice();
		} while (val1 === 1);

		// load the page again and check if the value matches with the first rolled value
		await page.goto(url, { waitUntil: "domcontentloaded" });
		const diceElement2 = page.locator(".dice");
		const diceValue2 = await diceElement2.map((Text) => Text.textContent.codePointAt(0)).wait();
		// Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
		const val2 = diceValue2 - 0x267f;

		expect(val1).toEqual(val2);
	});
});
