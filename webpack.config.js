/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env) => {
  const htmlTemplate = "./src/index.html";
  const plugins =
    env && env.clean
      ? [
          new CleanWebpackPlugin(),
          new HtmlWebpackPlugin({ template: htmlTemplate }),
        ]
      : [new HtmlWebpackPlugin({ template: htmlTemplate })];

  const mode = env && env.prod ? "production" : "development";

  return {
    devtool: "inline-source-map",
    entry: {
      app: "./src/app.js",
    },
    mode,
    output: {
      filename: "[name].[contenthash].js",
    },
    plugins,
    devServer: {
      open: true,
    },
  };
};
