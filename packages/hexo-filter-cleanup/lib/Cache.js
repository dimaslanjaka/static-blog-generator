/* Memory Cache */
/* global hexo */
const log = require("hexo-log")({
  debug: false,
  silent: false,
});
const fs = require("fs");
const { buildDir } = require("./Config");
const path = require("path");
class Cache {
  /**
   * Cache result
   * @type {object}
   */
  result = {};
  dbJson = path.join(buildDir, "db.json");

  constructor(dbname) {
    if (typeof dbname == "string" && dbname.length > 0) {
      this.dbJson = path.join(buildDir, dbname + "-db.json");
    }
  }

  /**
   * Load Cache
   * @returns {this}
   */
  load() {
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);
    if (!fs.existsSync(this.dbJson)) {
      fs.writeFileSync(this.dbJson, JSON.stringify({}));
    }
    this.result = JSON.parse(fs.readFileSync(this.dbJson).toString());
    return this;
  }

  /**
   *
   */
  add(key, value) {
    this.result[key] = value;
  }

  /**
   * get keys from database
   * @returns {string[]}
   */
  getKeys() {
    return Object.keys(this.result);
  }

  /**
   * Get databases
   * @returns {{}}
   */
  getDatabases() {
    const result = {};
    for (const key in this.result) {
      // replace hexo base dir source to valid web path
      result[key] = this.result[key];
    }
    return result;
  }

  save() {
    log.log("save", Object.keys(this.result).length, "items");
    fs.writeFileSync(this.dbJson, JSON.stringify(this.result));
    return this;
  }

  toString() {
    return JSON.stringify(this.result, null, 2);
  }
}

module.exports = Cache;
