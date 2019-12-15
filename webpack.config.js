const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    stats: "minimal",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist", "public"),
        filename: "[name].bundle.js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlPlugin({
            template: "./index.html"
        })
    ]
}