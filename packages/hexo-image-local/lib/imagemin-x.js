const mozjpeg = require("imagemin-mozjpeg");
const gifsicle = require("imagemin-gifsicle");
const jpegtran = require("imagemin-jpegtran");
const optipng = require("imagemin-optipng");
const svgo = require("imagemin-svgo");
const pngquant = require("imagemin-pngquant");
const Imagemin = require("imagemin");

function hexo_all_minifier(buffer, path, options, hexo) {
  const route = hexo.route;
  // Filter routes to select all images.
  const log = hexo.log || console;

  // Create the Imagemin instance.
  const imageminOption = {
    plugins: [
      mozjpeg({ progressive: options.progressive }),
      gifsicle({ interlaced: options.interlaced }),
      jpegtran({ progressive: options.progressive }),
      optipng({ optimizationLevel: options.optimizationLevel }),
      svgo({ multipass: options.multipass }),
    ],
  };

  // Add additional plugins.
  if (options.pngquant) {
    // Lossy compression.
    imageminOption.plugins.push(pngquant());
  }

  return Imagemin.buffer(buffer, imageminOption).then((newBuffer) => {
    const length = buffer.length;
    if (newBuffer && length > newBuffer.length) {
      const saved = (((length - newBuffer.length) / length) * 100).toFixed(2);
      log[options.silent ? "debug" : "info"]("IMG: %s [ %s ]", path, saved + "%");
      route.set(path, newBuffer); // Update the route.
    }
  });
}

module.exports = hexo_all_minifier;
