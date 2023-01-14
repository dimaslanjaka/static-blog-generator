const TerserPlugin = require('terser-webpack-plugin');
const path = require('upath');
const webpack = require('webpack');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const postcssConfig = require('./postcss.config');

const entry = {
  ['markdownit.js']: 'markdown-it',
  ['hljs.js']: 'highlight.js',
  ['lodash.js']: 'lodash',
  ['codemirror.js']: './source/libs/codemirror',
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
    new CleanWebpackPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: postcssConfig
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|otf|eot|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'assets/fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)(\?[a-z0-9=.]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'assets/img/[name].[ext]'
            }
          }
        ]
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
  devtool: 'inline-source-map',
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'src/public/js'),
    libraryTarget: 'var',
    library: 'SBGServer',
    pathinfo: true,
    globalObject: 'this',
    chunkFilename: 'chunks/[name].[chunkhash].js',
    assetModuleFilename: 'media/[name][hash][ext][query]'
  },
  target: ['web', 'es5'],
  mode: 'production',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all'
    },
    minimize: process.env.NODE_ENV === 'development' ? false : true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.(css|js)$/,
        extractComments: false,
        terserOptions: {
          format: {
            comments: false
          }
        }
      })
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css']
  }
};
