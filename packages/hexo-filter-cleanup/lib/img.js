/* global hexo */
"use strict";

const Promise = require("bluebird");
const minimatch = require("minimatch");

const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");
const imageminPng = require("imagemin-pngquant");
const imageminGif = require("imagemin-gifsicle");
const imageminJpeg = require("imagemin-jpegtran");
const imageminPng2 = require("imagemin-optipng");
const imageminSvg = require("imagemin-svgo");
const imageminJpegRecompress = require("imagemin-jpeg-recompress");

const streamToArray = require("stream-to-array");
const sysPath = require("path");

const streamToArrayAsync = Promise.promisify(streamToArray);
const pkg = require("../package.json");
const utils = require("./utils");
let log = require("./Console");
const cacheLib = require("./Cache");
const cache = new cacheLib("img");
cache.load();
const { buildDir, pkgLoc } = require("./Config");
const fs = require("fs");
const { join } = require("path");
const Write = require("./Write");
const path = require("path");

function WriteCache(file, buffer, hexo) {
  let toCache = join(hexo.base_dir, "source/img/compressed", file);
  if (!fs.existsSync(toCache)) {
    Write(toCache, buffer);
    cache.add(file, toCache.replace(path.join(hexo.base_dir, "source")));
    //log.log("saved", cacheLib.result.length, "items");
    cache.save();
  }
}

/**
 * Image compressor
 * @returns {Promise<Buffer>}
 */
module.exports = function () {
  // Init.
  const hexo = this,
    options = hexo.config.hfc_img,
    route = hexo.route;

  // Return if disabled.
  if (false === options.enable) return;

  /**
   * Filter routes to select all images.
   * @type {string[]}
   */
  const routes = route.list().filter(
    /**
     * Filter string path
     * @param {string} path
     * @returns {boolean}
     */
    function (path) {
      return minimatch(path, "**/*.{gif,jpg,png,svg,webp}", { nocase: true }) && !utils.isIgnore(path, options.exclude);
    }
  );

  log = hexo.log || console;
  /**
   * Retrieve image contents, and minify it.
   */
  const returnPromises = Promise.map(routes, function (path) {
    if (typeof cache.getDatabases()[path] == "string") {
      //log.log("Loading cached", path);
    }

    // Retrieve and concatenate buffers.
    const stream = route.get(path);
    const ext = sysPath.extname(path).toLowerCase();

    /**
     * @type {Promise<Buffer>}
     */
    let streamArray = streamToArrayAsync(stream)
      .then(function (arr) {
        return Buffer.concat(arr);
      })
      .then(function (buffer) {
        //console.log()
        // Create the Imagemin instance.
        const imageminOption = {
          plugins: [],
        };

        if (options.gifsicle && ext === ".gif") {
          imageminOption.plugins.push(imageminGif({ interlaced: options.interlaced }));
        }

        if (options.jpegtran && [".jpg", ".jpeg"].indexOf(ext) !== -1) {
          imageminOption.plugins.push(imageminJpeg({ progressive: options.progressive }));
        }

        if (options.optipng && ext === ".png") {
          imageminOption.plugins.push(imageminPng2({ optimizationLevel: options.optimizationLevel }));
        }

        if (options.svgo && ext === ".svg") {
          imageminOption.plugins.push(imageminSvg({ multipass: options.multipass }));
        }

        if (options.webp && ext === ".webp") {
          imageminOption.plugins.push(imageminWebp({ quality: options.webpQuality }));
        }

        // Add additional plugins.
        if (options.pngquant && ext === ".png") {
          // Lossy compression.
          imageminOption.plugins.push(imageminPng());
        }

        if (options.jpegrecompress && [".jpg", ".jpeg"].indexOf(ext) !== -1) {
          imageminOption.plugins.push(imageminJpegRecompress({ quality: options.jpegrecompressQuality }));
        }

        const returnBuffer = imagemin.buffer(buffer, imageminOption).then(function (newBuffer) {
          const length = buffer.length;
          if (newBuffer && length > newBuffer.length) {
            const saved = (((length - newBuffer.length) / length) * 100).toFixed(2);
            //log.log("%s(IMG): %s [%s saved]", pkg.name, path, saved + "%");
            log.log(`${path} [${saved}% saved]`);
            WriteCache(path, newBuffer, hexo);
            route.set(path, newBuffer); // Update the route.
          }
        });

        //log.log(returnBuffer);

        return returnBuffer;
      });

    //log.log(streamArray);
    return streamArray;
  });

  //log.log("returnPromises", returnPromises);
  return returnPromises;
};
