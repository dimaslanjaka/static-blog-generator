const Promise = require("bluebird");
const minimatch = require("minimatch");

function Opt() {
  let hexo = this;
  const route = hexo.route;
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

  let targetFile = ["jpg", "gif", "png", "svg", "jpeg"];

  // exclude image
  const routes = route.list().filter((path) => {
    return minimatch(path, "*.{" + targetFile.join(",") + "}", {
      nocase: true,
      matchBase: true,
    });
  });
  // Filter routes to select all images.
  const log = hexo.log || console;
  // Retrieve image contents, and minify it.
  return Promise.map(routes, (path) => {
    // Retrieve and concatenate buffers.
    const stream = route.get(path);
    const arr = [];
    stream.on("data", (chunk) => arr.push(chunk));
    return new Promise((resolve, reject) => {
      stream.on("end", () => resolve(Buffer.concat(arr)));
    }).then((buffer) => {
      console.log(buffer);
      return require("./imagemin-x")(options);
    });
  });
}

module.export = Opt;
