const path = require("path");
const pkg = require("../package.json");
const config = {
  /**
   * Location build directory
   */
  buildDir: path.join("build", pkg.name),
  /**
   * object hexo-filter-cleanup package.json
   */
  pkg: pkg,
  /**
   * hexo-filter-cleanup base location
   */
  pkgLoc: path.join(__dirname, "/../"),
};

module.exports = config;
