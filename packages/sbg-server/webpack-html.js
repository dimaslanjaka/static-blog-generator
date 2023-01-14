const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

webpack(
  {
    entry: './source/views/layout.njk', //relative to root of the application
    output: {
      filename: '[name]',
      path: path.resolve(__dirname, 'src/public'),
      libraryTarget: 'var',
      library: 'SBGServer',
      pathinfo: true,
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            'isomorphic-style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader' /*MiniCssExtractPlugin.loader,*/
          ]
        },
        {
          test: /\.(html|njk)$/i,
          loader: 'html-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      //new MiniCssExtractPlugin({ filename: '[name].min.css' }),
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map'
      }),
      new HtmlWebpackPlugin({
        hash: false,
        filename: '[name]' //relative to root of the application
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
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
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.njk']
    },
    target: ['web', 'es5'],
    mode: 'development'
  },
  function (err, stats) {
    if (!err) {
      console.log(stats.toString());
    } else {
      console.log(err.toString());
    }
  }
);
