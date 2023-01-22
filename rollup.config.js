const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const pkg = require('./package.json');
const json = require('@rollup/plugin-json');

module.exports = {
  input: pkg.main,
  output: {
    dir: 'lib',
    format: 'cjs'
  },
  plugins: [commonjs(), nodeResolve(), json()]
};
