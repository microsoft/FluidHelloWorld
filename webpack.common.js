/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = {
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader"
        }]
    },
    output: {
        filename: "[name].[contenthash].js",
    },
    devtool: "inline-source-map",
};
