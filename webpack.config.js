const nodeExternals = require('webpack-node-externals')
const tsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const copyPlugin = require('copy-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
        options: {
          transpileOnly: true,
          happyPackMode: true
        }
      }
    ],
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new tsConfigPathsPlugin()]
  },
  output: {
    libraryTarget: 'commonjs',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new copyPlugin([
      {
        from: 'readme.md'
      }
    ]),
  ],
  node: {
    __dirname: false
  },
};
