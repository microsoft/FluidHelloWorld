/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
	const htmlTemplate = "./src/index.html";
	const plugins = [new HtmlWebpackPlugin({ template: htmlTemplate })];

	const mode = env && env.prod ? "production" : "development";

	return {
		devtool: "inline-source-map",
		entry: {
			app: "./src/app.js",
		},
		mode,
		output: {
			filename: "[name].[contenthash].js",
			clean: true,
		},
		plugins,
		devServer: {
			open: false,
		},
	};
};
