const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebExtWebpackPlugin } = require("webext-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

var alias = {};
const fileExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "eot",
  "otf",
  "svg",
  "ttf",
  "woff",
  "woff2",
];

module.exports = (env) => {
  const options = {
    mode: env || "development",
    entry: {
      browser_action: path.join(
        __dirname,
        "src",
        "browserAction",
        "browser_action_script.js"
      ),
      options_script: path.join(
        __dirname,
        "src",
        "options",
        "options_script.js"
      ),
      background_script: path.join(__dirname, "src", "background_script.js"),
      content_script: path.join(__dirname, "src", "content_script.js"),
    },
    output: {
      path: path.join(__dirname, "dist"),
    },
    resolve: {
      alias: alias,
      extensions: fileExtensions
        .map((extension) => "." + extension)
        .concat([".jsx", ".js", ".css"]),
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            warnings: false,
            compress: {
              comparisons: false,
            },
            parse: {},
            mangle: true,
            output: {
              comments: false,
              /* eslint-disable camelcase */
              ascii_only: true,
              /* eslint-enable camelcase */
            },
          },
          parallel: true,
          cache: true,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          loader: "style-loader!css-loader",
          exclude: /node_modules/,
        },
        {
          test: new RegExp(".(" + fileExtensions.join("|") + ")$"),
          loader: "file-loader",
          exclude: /node_modules/,
          query: {
            outputPath: "./assets/",
            name: "[name].[ext]",
          },
        },
        {
          test: /\.html$/,
          loader: "html-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      //new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: "src/manifest.json",
            transform: function (content, path) {
              // generates the manifest file using the package.json informations
              return Buffer.from(
                JSON.stringify({
                  description: process.env.npm_package_description,
                  version: process.env.npm_package_version,
                  ...JSON.parse(content.toString()),
                })
              );
            },
          },
          {
            from: "src/browser_polyfill.js",
            to: "",
          },
        ],
      }),
      new HtmlWebPackPlugin({
        template: path.join(
          __dirname,
          "src",
          "browserAction",
          "browser_action.html"
        ),
        filename: "browser_action.html",
        chunks: ["browser_action"],
      }),
      new HtmlWebPackPlugin({
        template: path.join(__dirname, "src", "options", "options.html"),
        filename: "options.html",
        chunks: ["options_script"],
      }),
      new WriteFilePlugin(),
    ],
  };

  if (env === "development") {
    options.devtool = "cheap-module-eval-source-map";
  }
  return options;
};
