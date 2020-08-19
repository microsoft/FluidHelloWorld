const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => {
    return ({
        entry: {
            app: "./src/app.ts"
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        module: {
            rules: [{
                test: /\.ts?$/,
                loader: "ts-loader"
            }]
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
            library: "[name]",
            // https://github.com/webpack/webpack/issues/5767
            // https://github.com/webpack/webpack/issues/7939
            devtoolNamespace: "@fluid-example/hello-world",
            libraryTarget: "umd"
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),
        ],
        mode: "development",
        devtool: "inline-source-map"
    });
};
