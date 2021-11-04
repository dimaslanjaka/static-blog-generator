// eslint-disable-next-line no-unused-vars
/* global hexo */
"use strict";

module.exports = {
  userefHTML: require("./useref"),
  optimizeHTML: require("./html"),
  optimizeCSS: require("./css"),
  optimizeJS: require("./js"),
  optimizeImage: require("./img"),
  genFavicons: require("./favicons"),
};
