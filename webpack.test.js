/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const merge = require("webpack-merge");
const common = require("./webpack.common");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    entry: {
        app: "./test/index.ts"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./test/index.html",
        }),
    ],
    mode: "development",
});
