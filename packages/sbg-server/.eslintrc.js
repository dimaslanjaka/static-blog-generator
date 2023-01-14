const prettier = require('./.prettierrc.json');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: '../../.eslintrc.js',
  env: {
    browser: true, // add support for browser js (window,document,location,etc)
    amd: true, // add amd support
    node: true // add node support (module.export,etc)
  },
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  rules: {
    'prettier/prettier': ['error', prettier]
  }
};
