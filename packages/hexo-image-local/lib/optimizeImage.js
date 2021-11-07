"use strict";
const Imagemin = require("imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const gifsicle = require("imagemin-gifsicle");
const jpegtran = require("imagemin-jpegtran");
const optipng = require("imagemin-optipng");
const svgo = require("imagemin-svgo");

const Promise = require("bluebird");
const minimatch = require("minimatch");

// Configure.

function OptimizeImage() {
  // Init.
  const hexo = this;
  const options = (hexo.config.image_minifier = Object.assign(
    {
      enable: true,
      interlaced: false,
      multipass: false,
      optimizationLevel: 3,
      pngquant: false,
      progressive: false,
      silent: false,
    },
    hexo.config.image_minifier
  ));

  const route = hexo.route;
  let targetExtensions = ["jpg", "gif", "png", "svg"];

  // Return if disabled.
  if (options.enable === false) return;
  // filter target files
  if (options.exclude && options.exclude.length) {
    targetExtensions = targetExtensions.filter((t) => options.exclude.every((p) => !p.includes(t, p)));
  }

  // exclude image
  const routes = route.list().filter((path) => {
    return minimatch(path, "*.{" + targetExtensions.join(",") + "}", {
      nocase: true,
      matchBase: true,
    });
  });

  // Retrieve image contents, and minify it.
  return Promise.map(routes, (path) => {
    // Retrieve and concatenate buffers.
    const stream = route.get(path);
    const arr = [];
    stream.on("data", (chunk) => arr.push(chunk));
    return new Promise((resolve, reject) => {
      stream.on("end", () => resolve(Buffer.concat(arr)));
    }).then((buffer) => {
      return require("./imagemin-x")(buffer, path, options, hexo);
    });
  });
}

module.exports = OptimizeImage;
