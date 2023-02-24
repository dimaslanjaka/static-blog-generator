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
const globals = {
  jquery: '$',
  moment: 'moment',
  'moment-timezone': 'momentTimezone',
  flowbite: 'flowbite',
  'core-js': 'CoreJS',
  'highlight.js': 'hljs',
  axios: 'axios',
  'markdown-it': 'MarkdownIt',
  codemirror: 'CodeMirror'
};

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
      name: path.basename(o.output),
      globals
    };
  }),
  external: Object.keys(globals), // <-- suppresses the warning
  plugins: [resolve(), commonjs(), multi()]
};
