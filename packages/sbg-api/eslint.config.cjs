const path = require('path');

/**
 * @type {import('eslint').ESLint.ConfigData}
 */
const config = {
  extends: path.resolve(__dirname, '../eslint.config.cjs')
};

module.exports = config;
