const prettier = require('./.prettierrc.json');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: '../../.eslintrc.js',
  rules: {
    'prettier/prettier': ['error', prettier]
  }
};
