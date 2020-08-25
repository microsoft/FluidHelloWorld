/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
    const appEntry = env && env.test
        ? "./test/app.ts"
        : "./src/app.ts";

    const htmlTemplate = env && env.test
        ? "./test/index.html"
        : "./src/index.html";
    
    const plugins = env && env.prod
        ? [new CleanWebpackPlugin(), new HtmlWebpackPlugin({ template: htmlTemplate })]
        : [new HtmlWebpackPlugin({ template: htmlTemplate })];

    const mode = env && env.prod
        ? "production"
        : "development";

    return {
        devtool: "inline-source-map",
        entry: {
            app: appEntry,
        },
        mode,
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader"
            }]
        },
        output: {
            filename: "[name].[contenthash].js",
        },
        plugins,
        resolve: {
            extensions: [".ts", ".js"],
        },
        
    };
};
