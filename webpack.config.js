const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  mode: "production",
  watch: false,
  target: 'node-webkit',
  entry: {
    app: './app/index.js',
  },
  output: {
    path: __dirname + '/build',
    publicPath: 'build/',
    filename: '[name].js',
    // sourceMapFilename: '[name].js.map',
  },
  // Could not get these to work properly (Chrome appears to have a but at time
  // of writing), but these are our source-map options:
  // devtool: 'source-map',
  // devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)?$/,
        loader: 'babel-loader',
        options: {
          compact: false,
          presets: [
            [
              '@babel/preset-typescript', {
                "isTSX": true,
                "allExtensions": true,
              }
            ],
          '@babel/preset-react'
          ],
          plugins: [ '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-optional-chaining' ]
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader',
          options: {
            compact: false,
            modules: true,
          }
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.ts', '.json', '.jsx', '.tsx']
  },

  stats: {
    // Silence warnings which are actually false positives.
    warningsFilter: [
      '"export \'CannonDebugRenderer\' (imported as \'THREE\') was not found in \'three\'',
      (warning) => false
    ]
  }
};
