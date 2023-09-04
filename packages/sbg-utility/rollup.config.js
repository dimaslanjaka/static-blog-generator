const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const json = require('@rollup/plugin-json');
//const typescript = require('@rollup/plugin-typescript');
//const tsconfig = require('./tsconfig.build.json');
//const tsbase = require('./tsconfig.base.json');
const lib = require('./package.json');
const outputFileName = 'sbg-utility';
const name = 'sbg-utility';
const input = './dist/index.js';
const polyfill = require('rollup-plugin-polyfill-node');

/**
 *
 * @param {import('rollup').RollupOptions} config
 * @returns
 */
const buildConfig = (config) => {
  /*const tsOpt = Object.assign(tsbase, tsconfig, {
    compilerOptions: {
      module: 'esnext',
      lib: ['es2020', 'dom'],
      target: 'es5',
      allowSyntheticDefaultImports: true,
      skipLibCheck: true
    }
  });
  if (tsOpt.extends) delete tsOpt.extends;*/
  // plugins: [typescript(tsOpt)]
  const build = ({ minified }) => ({
    input,
    ...config,
    output: {
      ...config.output,
      file: `${config.output.file}.${minified ? 'min.js' : 'js'}`
    },
    plugins: [
      json(),
      polyfill(),
      resolve({ preferBuiltins: true, browser: true }),
      commonjs(),
      minified && terser(),
      ...(config.plugins || [])
    ]
  });

  return [build({ minified: false }), build({ minified: true })];
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
    }),

    ...buildConfig({
      output: {
        file: `dist/esm/${outputFileName}`,
        format: 'esm',
        preferConst: true,
        exports: 'named',
        banner
      }
    })
  ];
};

module.exports = defaults;
