/* global hexo */
"use strict";

const Promise = require("bluebird");
const minimatch = require("minimatch");
const uglifyJS = require("uglify-js");
const pkg = require("../package.json");
const utils = require("./utils");
const Terser = require("terser");

module.exports = function (str, data) {
  let hexo = this,
    log = hexo.log || console,
    options = hexo.config.hfc_js;
  // Return if disabled.
  if (false === options.enable) return;

  let path0 = data.path;

  if (utils.isIgnore(path0, options.exclude)) return str;

  // delete none-uglifyjs options
  delete options.enable;
  delete options.exclude;

  return new Promise(function (resolve, reject) {
    // noinspection DuplicatedCode
    utils.isFileChanged(path0).then(async (yes) => {
      let rstr = "";
      if (!yes) {
        rstr = utils.getFileCache(path0);
        return resolve(rstr);
      }
      // file was changed
      //let result = uglifyJS.minify(str, options);
      const result = await Terser.minify(str, {
        parse: {
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,
          arrows: false,
          collapse_vars: false,
          comparisons: false,
          computed_props: false,
          hoist_funs: false,
          hoist_props: false,
          hoist_vars: false,
          inline: false,
          loops: false,
          negate_iife: false,
          properties: false,
          reduce_funcs: false,
          reduce_vars: false,
          switches: false,
          toplevel: false,
          typeofs: false,
          booleans: true,
          if_return: true,
          sequences: true,
          unused: true,
          conditionals: true,
          dead_code: true,
          evaluate: true,
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true,
        },
      });
      // minify fails, use raw code and print warning msg
      if (result.hasOwnProperty("error")) {
        log.warn("%s(JS): %s Error: [ %s ], Skip minifying.", pkg.name, path0, result.error);
        return resolve(str);
      }
      let saved = (((str.length - result.code.length) / str.length) * 100).toFixed(2);
      log.log("%s(JS): %s [ %s saved]", pkg.name, path0, saved + "%");

      utils.setFileCache(path0, result.code);
      resolve(result.code);
    });
  });
};
