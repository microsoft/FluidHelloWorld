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
      }, 45000);

      beforeEach(async () => {
        await page.goto(config.globals.PATH, { waitUntil: "load" });
        await page.waitFor(() => window["fluidStarted"]);
        url = await page.url();
    });

      it('Load the container', async () => {
        await page.goto(url, { waitUntil: "domcontentloaded" });
      });

      it('roll and load the dice', async () => {
        // get the dice value after first roll
        await page.waitForSelector('.dice');
        let element1 = await page.$('.dice');
        // Validate there is a button that can be clicked
        await expect(page).toClick("button", { text: "Roll" });
        const value1 = await page.evaluate(el => el.textContent, element1);
        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        const val1 = value1.codePointAt(0) - 0x267f;

        // load the page again and check if the value matches with the first rolled value
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector('.dice');
        let element2 = await page.$('.dice');
        const value2 = await page.evaluate(e2 => e2.textContent, element2);
        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        const val2 = value2.codePointAt(0) - 0x267f;
        
        expect(val1).toEqual(val2);
      });
});