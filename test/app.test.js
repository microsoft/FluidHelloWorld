/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const config = require("../jest.config");

let url;

describe("fluid-hello-world", () => {
    beforeAll(async () => {
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

      it('Roll the dice', async () => {
        await expect(page).toClick("button", { text: "Roll" });
      })
});