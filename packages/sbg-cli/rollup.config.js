import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs-extra';
import * as glob from 'glob';
import url from 'node:url';
import path from 'path';
import { external, tsconfig } from './rollup.utils.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('./package.json')}
 */
const { author, version, name } = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));

const year = new Date().getFullYear();
const banner = `// ${name} v${version} Copyright (c) ${year} ${author}`;

/**
 * @type {import('rollup').RollupOptions['input']}
 */
const inputs = glob.globSync('src/**/*.{ts,js,cjs,mjs}', {
  posix: true,
  ignore: tsconfig.exclude.concat('*.runner.*', '*.explicit.*', '*.test.*', '*.builder.*', '*.spec.*')
});

const plugins = [
  json(),
  resolve({ preferBuiltins: true }), // Resolve node_modules packages
  commonjs(), // Convert CommonJS modules to ES6
  typescript({
    tsconfig: false,
    compilerOptions: tsconfig.compilerOptions,
    include: ['./src/**/*'],
    exclude: tsconfig.exclude,
    resolveJsonModule: true,
    sourceMap: false,
    inlineSourceMap: false
  }) // Compile TypeScript files
];

/**
 * @type {import('rollup').RollupOptions}
 */
const _partials = {
  input: inputs,
  output: [
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      globals: {
        hexo: 'hexo'
      },
      banner
    },
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      entryFileNames: '[name].cjs',
      globals: {
        hexo: 'hexo'
      },
      banner
    },
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      entryFileNames: '[name].mjs',
      globals: {
        hexo: 'hexo'
      },
      banner
    }
  ],
  plugins,
  external // External dependencies package name to exclude from bundle
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
  plugins,
  external // External dependencies package name to exclude from bundle
};

export default [_partials];
