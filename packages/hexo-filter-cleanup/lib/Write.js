const fs = require("fs");
const path = require("path");
/**
 * Write to file recursive mkdir automatically
 * @param {string} file
 * @param {string|Buffer} content
 */
module.exports = function (file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
