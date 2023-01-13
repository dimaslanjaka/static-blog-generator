const TerserPlugin = require('terser-webpack-plugin');
const path = require('upath');
const webpack = require('webpack');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    app: path.resolve(__dirname + '/source/scripts/app.js')
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components|.test.(m?js|ts)$)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src/public/js'),
    sourceMapFilename: '[name].[ext].map',
    library: 'safelinkify',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
