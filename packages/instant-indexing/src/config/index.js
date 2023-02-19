const { readdirSync, readFileSync } = require('fs-extra');
const { join } = require('upath');

const readDir = readdirSync(__dirname)
  .filter((str) => str.endsWith('.json'))
  .map((str) => join(__dirname, str));

/**
 * @type {import('../globals').ServiceConfig}
 */
let serviceConfig;

if (readDir.length > 0) {
  serviceConfig = readDir
    .map((keyFile) => Object.assign({ keyFile }, JSON.parse(readFileSync(keyFile, 'utf-8'))))
    .filter((o) => 'project_id' in o);
}

function getApiConfig(index = 0) {
  return readDir
    .map((path) => Object.assign({ keyFile: path }, JSON.parse(readFileSync(path, 'utf-8'))))
    .filter((o) => 'web' in o)[index];
}

async function getServiceAccount() {
  return {
    key: (await import('./service-account.json')).default,
    path: join(__dirname, 'service-account.json')
  };
}

module.exports = {
  default: serviceConfig,
  getApiConfig,
  getServiceAccount
};

// module.exports = serviceConfig;
