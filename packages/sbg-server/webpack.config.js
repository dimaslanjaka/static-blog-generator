const TerserPlugin = require('terser-webpack-plugin');
const path = require('upath');
const webpack = require('webpack');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entry = {
  ['markdownit.js']: 'markdown-it',
  ['hljs.js']: 'highlight.js',
  ['lodash.js']: 'lodash',
  ['codemirror.js']: './source/styles/codemirror',
  ['axios.js']: 'axios'
};

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: Object.assign(
    entry,
    Object.fromEntries(
      glob.sync(path.resolve(__dirname, 'source/scripts/**/*.js')).map((v) => [
        v.split('source/scripts/')[1],
        {
          import: ['babel-polyfill', v],
          dependOn: [
            'markdownit.js',
            'axios.js',
            'hljs.js',
            'codemirror.js',
            'lodash.js'
          ]
        }
      ])
    )
  ),
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components|.test.(m?js|ts)$)/,
        use: {
          loader: 'babel-loader',
          options: {
            exclude: [
              // \\ for Windows, / for macOS and Linux
              /node_modules[\\/]core-js/,
              /node_modules[\\/]webpack[\\/]buildin/
            ],
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  useBuiltIns: 'entry',
                  targets: { chrome: '58', ie: '11' },
                  corejs: 3
                }
              ]
            ]
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'src/public/js'),
    libraryTarget: 'var',
    library: 'EntryPoint',
    pathinfo: true,
    globalObject: 'this'
  },
  mode: 'production',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all'
    },
    minimize: process.env.NODE_ENV === 'development' ? false : true,
    minimizer: [new TerserPlugin()]
  }
};
