const path = require('upath');
const glob = require('glob');
const resolve = require('@rollup/plugin-node-resolve').default;
const json = require('@rollup/plugin-json').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const multi = require('@rollup/plugin-multi-entry').default;
const { dts } = require('rollup-plugin-dts');
const typescript = require('@rollup/plugin-typescript').default;
const pkg = require('./package.json');
const _ = require('lodash');

const external = _.uniq(
  Object.keys(pkg.dependencies)
    .concat(Object.keys(pkg.devDependencies))
    .concat(
      'hexo',
      'warehouse',
      'hexo-util',
      'canvas',
      'jsdom',
      'mime-types',
      'sbg-utility',
      'through2',
      'gulp',
      'bluebird',
      'upath',
      'fs-extra',
      'cheerio',
      'axios',
      'minimatch'
    )
).filter((pkgName) => {
  return !['p-limit', 'deepmerge-ts'].includes(pkgName);
});

const src = path.join(__dirname, './source/scripts');
const dist = path.join(__dirname, './src/public/js');
const scan = glob.sync('**/*.js', { cwd: src }) || [];
const entries = scan.map((str) => {
  return {
    input: path.join(src, str),
    output: path.join(dist, str)
  };
});
const browserGlobals = {
  jquery: '$',
  moment: 'moment',
  'moment-timezone': 'MomentTimezone',
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
const umd = {
  input: entries.map((o) => o.input),
  output: entries.map((o) => {
    return {
      // dir: dist,
      file: o.output,
      format: 'umd',
      name: path.basename(o.output),
      globals: browserGlobals
    };
  }),
  external: Object.keys(browserGlobals), // <-- suppresses the warning
  plugins: [resolve({ browser: true }), commonjs(), multi()]
};

/**
 * @type {import('rollup').RollupOptions}
 */
const _onefile = {
  input: 'src/index.ts',
  output: [
    // bundle .js as ESM
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: false,
      globals: {
        hexo: 'hexo'
      },
      inlineDynamicImports: true
    },
    // bundle .cjs as CommonJS
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: false,
      globals: {
        hexo: 'hexo'
      },
      inlineDynamicImports: true
    },
    // build .mjs as ESM
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: false,
      globals: {
        hexo: 'hexo'
      },
      inlineDynamicImports: true
    }
  ],
  plugins: [
    json(),
    resolve({ preferBuiltins: true }), // Resolve node_modules packages
    commonjs(), // Convert CommonJS modules to ES6
    typescript({
      tsconfig: './tsconfig.json',
      include: ['./src/**/*'],
      exclude: [
        '**/dist/**',
        '**/tmp/**',
        '**/*.builder.*',
        '**/*.runner.*',
        '**/*.test.*',
        '**/*.spec.*',
        '**/*.specs.*'
      ],
      resolveJsonModule: true,
      resolvePackageJsonImports: true
    }) // Compile TypeScript files
  ],
  external // External dependencies package name to exclude from bundle
};

/**
 * @type {import('rollup').RollupOptions}
 */
const declaration = {
  input: './tmp/dist/index.d.ts',
  output: [{ file: 'dist/index.d.ts', format: 'es' }],
  plugins: [
    resolve({ preferBuiltins: true }),
    dts({ tsconfig: './tsconfig.build.json' })
  ]
};

module.exports = [umd, declaration];
