// const commonjs = require('@rollup/plugin-commonjs');
// const { nodeResolve } = require('@rollup/plugin-node-resolve');
// const pkg = require('./package.json');
const json = require('@rollup/plugin-json');
const tsc = require('rollup-plugin-typescript2');

module.exports = {
  input: ['src/index.ts'],
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'cjs',
    exports: 'named'
  },
  plugins: [/*commonjs(), nodeResolve(),*/ json(), tsc()]
};
