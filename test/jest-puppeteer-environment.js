/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const PuppeteerEnvironment = require("jest-environment-puppeteer").default;

class CompatPuppeteerEnvironment extends PuppeteerEnvironment {
	constructor(config, context) {
		super(config, context);
		if (
			this.moduleMocker !== undefined &&
			typeof this.moduleMocker.clearMocksOnScope !== "function"
		) {
			// Jest 30 runtime calls this hook; jest-environment-puppeteer still uses Jest 29's module mocker.
			this.moduleMocker.clearMocksOnScope = () => {};
		}
	}
}

module.exports = CompatPuppeteerEnvironment;
