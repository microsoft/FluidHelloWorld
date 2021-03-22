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

    let node = {};
    if (!(env && env.node)) {
        node = {
            net: 'empty',
            fs: 'empty',
            tls: 'empty',
            child_process: 'empty',
        }
    } else {

    }
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
        },
        node,
        devServer: {
            open: true
        },
        externals: [
            {
                formidable: 'commonjs formidable',
            },
        ],
    };
};
