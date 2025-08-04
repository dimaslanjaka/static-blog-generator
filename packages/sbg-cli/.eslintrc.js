/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: '../../.eslintrc.js',
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },
  env: {
    node: true // add node support (module.export,etc)
  },
  rules: {
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  }
};
