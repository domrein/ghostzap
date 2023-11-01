"use strict";

const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    library: {
      type: "module",
    },
  },
  module: {
    rules: [{
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: "asset/resource",
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: "asset/resource",
    }, {
      test: /\.mp3$/i,
      type: "asset/resource",
    }, {
      test: /\.json$/i,
      type: "asset/resource",
    }, {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    }, {
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'out'),
  },
  experiments: {
    outputModule: true,
  },
  mode: "development",
  devtool: "inline-source-map",
  watch: true,
  devServer: {
    static: "./out",
  },
};

