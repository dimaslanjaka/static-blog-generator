import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs-extra';
import * as glob from 'glob';
import url from 'node:url';
import path from 'path';
import polyfill from 'rollup-plugin-polyfill-node';
import { external, tsconfig } from './rollup.utils.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('./package.json')}
 */
const { author, version, name: _name } = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
const name = 'sbgUtility';
const outputFileName = 'sbg-utility';

const year = new Date().getFullYear();
const banner = `// ${_name} v${version} Copyright (c) ${year} ${author}`;

/**
 * @type {import('rollup').RollupOptions['input']}
 */
const inputs = glob.globSync('src/**/*.{ts,js,cjs,mjs}', {
  posix: true,
  ignore: tsconfig.exclude.concat('*.runner.*', '*.explicit.*', '*.test.*', '*.builder.*', '*.spec.*')
});

const plugins = [
  resolve({ preferBuiltins: true }), // Resolve node_modules packages
  commonjs(), // Convert CommonJS modules to ES6
  typescript({
    tsconfig: false,
    compilerOptions: tsconfig.compilerOptions,
    include: ['./src/**/*'],
    exclude: tsconfig.exclude
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
      format: 'cjs',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      globals: {
        hexo: 'hexo'
      }
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
      }
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
      }
    }
  ],
  plugins,
  external // External dependencies package name to exclude from bundle
};

/** @type {import('rollup').RollupOptions} */
const _browser = {
  input: './src/index.ts',
  output: {
    file: `dist/browser/${outputFileName}.js`,
    name,
    format: 'umd',
    exports: 'none',
    banner
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      include: './src/**/*',
      exclude: ['**/*.test.*']
    }),
    resolve({
      // To provide stubbed versions of Node built-ins with plugin rollup-plugin-polyfill-node
      preferBuiltins: false,
      // To instructs the plugin to use the browser module resolutions in package.json and adds 'browser' to exportConditions
      browser: true,
      extensions: ['.js', '.json', '.ts', '.cjs', '.mjs']
    }),
    json(),
    commonjs({
      requireReturnsDefault: 'auto'
    }),
    polyfill(),
    terser({ format: { ascii_only: true } })
  ]
};

const _oneFile = {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: false,
      exports: 'named',
      globals: {
        hexo: 'hexo'
      }
    },
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: false,
      exports: 'named',
      globals: {
        hexo: 'hexo'
      }
    },
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: false,
      exports: 'named',
      globals: {
        hexo: 'hexo'
      }
    }
  ],
  plugins,
  external
};

export default [_partials];
