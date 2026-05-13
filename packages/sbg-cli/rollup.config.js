import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import url from 'node:url';
import path from 'path';
import { dts } from 'rollup-plugin-dts';
import { external } from './rollup.utils.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('./package.json')}
 */
const { author, version, name } = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));

const year = new Date().getFullYear();
const banner = `// ${name} v${version} Copyright (c) ${year} ${author}`;

const plugins = [
  json(),
  resolve({ preferBuiltins: true }), // Resolve node_modules packages
  commonjs() // Convert CommonJS modules to ES6
];

/**
 * @type {import('rollup').RollupOptions}
 */
const _onefile = {
  input: 'tmp/dist/index.js',
  output: [
    // bundle .js as ESM
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: false,
      globals: {
        hexo: 'hexo'
      },
      inlineDynamicImports: true,
      banner
    },
    // bundle .cjs as CommonJS
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: false,
      globals: {
        hexo: 'hexo'
      },
      inlineDynamicImports: true,
      banner
    },
    // build .mjs as ESM
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: false,
      globals: {
        hexo: 'hexo'
      },
      inlineDynamicImports: true,
      banner
    }
  ],
  plugins,
  external // External dependencies package name to exclude from bundle
};

/**
 * @type {import('rollup').RollupOptions}
 */
const declaration = {
  input: './tmp/dist/index.d.ts',
  output: [{ file: 'dist/index.d.ts', format: 'es' }],
  plugins: [dts()]
};

export default [_onefile, declaration];
