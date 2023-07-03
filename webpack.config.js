const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = ({ mode } = { mode: "production" }) => {
  console.log(`mode is: ${mode}`);

  return {
    mode,
    entry: "./src/index.tsx",
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "build"),
      filename: "bundle.[contenthash].js",
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/, // add |ts
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.jpe?g|png$/,
          exclude: /node_modules/,
          use: ["url-loader", "file-loader"],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: ["file-loader"],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: { ext: "tsx" },
            },
            {
              loader: "file-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public/favicon.ico"),
            to: path.resolve(__dirname, "dist"),
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: `[name].[contenthash].css`,
      }),
    ],
  };
};
