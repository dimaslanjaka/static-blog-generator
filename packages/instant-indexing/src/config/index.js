const { readdirSync, readFileSync } = require('fs-extra');
const { join } = require('upath');

const readDir = readdirSync(__dirname)
  .filter((str) => str.endsWith('.json'))
  .map((str) => join(__dirname, str));

let serviceConfig;

if (readDir.length > 0) {
  serviceConfig = JSON.parse(readFileSync(readDir[0], 'utf-8'));
}

module.exports = serviceConfig;
