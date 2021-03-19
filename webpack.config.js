/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
    const htmlTemplate = "./src/index.html";
    const plugins = env && env.clean
        ? [new CleanWebpackPlugin(), new HtmlWebpackPlugin({ template: htmlTemplate })]
        : [new HtmlWebpackPlugin({ template: htmlTemplate })];

    const mode = env && env.prod
        ? "production"
        : "development";

    const target = env && env.node
        ? "node"
        : "web"

    const filename = env && env.node
        ? "[name].js"
        : "[name].[contenthash].js";

    return {
        devtool: "inline-source-map",
        entry: {
            app: "./src/app.ts",
            server: "./src/server.ts",
        },
        mode,
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader"
            }]
        },
        target: target,
        output: {
            filename: filename,
        },
        plugins,
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            alias: {
                vue$: "vue/dist/vue.esm-bundler.js",
            },
        },
        devServer: {
            open: true
        }
    };
};
