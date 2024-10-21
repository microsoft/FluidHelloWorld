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
		// The dice value is stored as alt text on the image element.
		// Parse and return that value as a number.
		const getDiceValue = async (diceElement) => {
			const alt = await diceElement.map((element) => element.alt).wait();
			return Number.parseInt(alt);
		};

		// Roll the specified dice element (click the roll button)
		const rollDice = async () => {
			// get the roll button element
			const rollButton = page.locator(".rollButton");

			// click the roll button
			await rollButton.click();
		};

		// Get the dice element
		const diceElement1 = page.locator(".dice");

		let dice1Value = await getDiceValue(diceElement1);

		// Validate if the initial dice value is equal to 1
		expect(dice1Value).toEqual(1);

		// Roll dice until value has changed in a way we can easily confirm (i.e. when it is no longer equal to 1)
		do {
			await rollDice();
			dice1Value = await getDiceValue(diceElement1);
		} while (dice1Value === 1);

		// load the page again and check if the value matches with the first rolled value
		await page.goto(url, { waitUntil: "domcontentloaded" });
		const diceElement2 = page.locator(".dice");
		const diceValue2 = await getDiceValue(diceElement2);

		expect(dice1Value).toEqual(diceValue2);
	});
});
