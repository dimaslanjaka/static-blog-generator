/* global hexo */
const hexoLog = require("hexo-log")({
  debug: false,
  silent: false,
});
let log;

class Console {
  static ids = [];
  static one(id, ...msg) {
    if (!Console.ids.includes(id)) {
      log.log(id, msg);
    }
  }
  static log() {}
  static sync() {
    log = hexo.log || console;
  }
}

module.exports = Console;
