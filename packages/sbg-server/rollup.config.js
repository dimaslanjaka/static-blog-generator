const path = require('upath');
const glob = require('glob');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const multi = require('@rollup/plugin-multi-entry');

const src = path.join(__dirname, './source/scripts');
const dist = path.join(__dirname, './src/public/js');
const scan = glob.sync('**/*.js', { cwd: src }) || [];
const entries = scan.map((str) => {
  return {
    input: path.join(src, str),
    output: path.join(dist, str)
  };
});

/**
 * @type {import('rollup').RollupOptions}
 */
module.exports = {
  input: entries.map((o) => o.input),
  output: entries.map((o) => {
    return {
      // dir: dist,
      file: o.output,
      format: 'umd',
      name: path.basename(o.output)
    };
  }),
  external: [
    'moment',
    'moment-timezone',
    'flowbite',
    'core-js',
    'highlight.js',
    'axios',
    'markdown-it'
  ], // <-- suppresses the warning
  plugins: [resolve(), commonjs(), multi()]
};
