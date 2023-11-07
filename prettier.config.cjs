/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = {
	...require("@fluidframework/build-common/prettier.config.cjs"),
	overrides: [
		{
			// YAML formatting should not use tabs, and use a 2-space indent instead
			files: ["*.yaml", "*.yml"],
			options: {
				tabWidth: 2,
				useTabs: false,
				quoteProps: "preserve",
			},
		},
	],
};
