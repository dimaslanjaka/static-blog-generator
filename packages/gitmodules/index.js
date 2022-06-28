const ini = require('ini');
const fs = require('fs');

/**
 * extract submodule to object
 * @param {string} path
 */
function extractSubmodule(path) {
  const config = ini.parse(fs.readFileSync(path).toString());
  Object.keys(config).forEach((key) => {
    if (key.startsWith('submodule')) {
      const submodule = config[key];
      console.log(submodule);
    }
  });
}

module.exports = extractSubmodule;
