const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');
const tsconfig = require('./tsconfig.build.json');
const tsbase = require('./tsconfig.base.json');
const lib = require('./package.json');
const polyfill = require('rollup-plugin-polyfill-node');
const { deepmerge } = require('deepmerge-ts');

const name = 'sbgUtility';
const outputFileName = 'sbg-utility';

const tsOpt = deepmerge(tsbase, tsconfig, {
  compilerOptions: {
    declaration: false
  }
});
['extends', 'display', '$schema', '_version'].forEach((pname) => {
  if (tsOpt[pname]) delete tsOpt[pname];
});

const year = new Date().getFullYear();
const banner = `// ${lib.name} v${lib.version} Copyright (c) ${year} ${lib.author}`;
/** @type {import('rollup').RollupOptions} */
const rollupConfig = {
  input: './dist/index-browser.js',
  output: {
    file: `dist/browser/${outputFileName}.js`,
    name,
    format: 'umd',
    exports: 'none',
    banner
  },
  plugins: [
    resolve.default({
      // To provide stubbed versions of Node built-ins with plugin rollup-plugin-polyfill-node
      preferBuiltins: false,
      // To instructs the plugin to use the browser module resolutions in package.json and adds 'browser' to exportConditions
      browser: true,
      extensions: ['.js', '.json', '.ts']
    }),
    json(),
    commonjs.default({
      requireReturnsDefault: 'auto'
    }),
    polyfill()
  ]
};

module.exports = rollupConfig;
