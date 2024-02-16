const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const json = require('@rollup/plugin-json');
const typescript = require('@rollup/plugin-typescript');
const tsconfig = require('./tsconfig.build.json');
const tsbase = require('./tsconfig.base.json');
const lib = require('./package.json');
const outputFileName = 'sbg-utility';
const name = 'sbg-utility';
const polyfill = require('rollup-plugin-polyfill-node');
const { deepmerge } = require('deepmerge-ts');

const tsOpt = deepmerge(tsbase, tsconfig, {
  compilerOptions: {
    module: 'esnext',
    lib: ['es2020', 'dom'],
    target: 'es5',
    allowSyntheticDefaultImports: true,
    skipLibCheck: true
  }
});
if (tsOpt.extends) delete tsOpt.extends;

/**
 *
 * @param {import('rollup').RollupOptions} config
 * @returns
 */
const buildConfig = (config) => {
  const build = ({ minified, input }) => {
    /** @type {import('rollup').RollupOptions} */
    const overrideConfig =  {
      input,
      ...config,
      output: {
        ...config.output,
        file: `${config.output.file}.${minified ? 'min.js' : 'js'}`
      },
      plugins: [
        typescript.default({ compilerOptions: tsOpt.compilerOptions, exclude: tsOpt.exclude }),
        // const json = require('@rollup/plugin-json');
        json(),
        // const polyfill = require('rollup-plugin-polyfill-node');
        polyfill(),
        // const resolve = require('@rollup/plugin-node-resolve');
        resolve({
          // To provide stubbed versions of Node built-ins with plugin rollup-plugin-polyfill-node
          preferBuiltins: false,
          // To instructs the plugin to use the browser module resolutions in package.json and adds 'browser' to exportConditions
          browser: true
        }),
        // const commonjs = require('@rollup/plugin-commonjs');
        commonjs({
          include: /node_modules/,
          requireReturnsDefault: 'auto'
        }),
        // const { terser } = require('rollup-plugin-terser');
        minified && terser(),
        ...(config.plugins || [])
      ]
    }
    return overrideConfig;
  };

  return [build({ minified: false, input: 'src/index.ts' }), build({ minified: true, input: 'src/index.ts' })];
};

const defaults = async () => {
  const year = new Date().getFullYear();
  const banner = `// ${lib.name} v${lib.version} Copyright (c) ${year} ${lib.author}`;

  return [
    ...buildConfig({
      output: {
        file: `dist/browser/${outputFileName}`,
        name,
        format: 'umd',
        exports: 'default',
        banner
      }
    })
  ];
};

module.exports = defaults;
