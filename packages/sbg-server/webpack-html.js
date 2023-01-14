const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

webpack(
  {
    entry: './source/views/layout.njk', //relative to root of the application
    output: {
      filename: './src/public/js/layout.bundle.js' //relative to root of the application
    },
    module: {
      rules: [
        {
          test: /\.(html|njk)$/i,
          loader: 'html-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        filename: './src/views/partials/bundle.njk' //relative to root of the application
      })
    ],
    mode: 'development'
  },
  function (err, stats) {
    console.log(stats.toString());
  }
);
