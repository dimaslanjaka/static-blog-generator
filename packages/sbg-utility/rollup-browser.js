import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import * as rimraf from 'rimraf';
import { rollup } from 'rollup';
import analyze from 'rollup-plugin-analyzer';
import polyfillNode from 'rollup-plugin-polyfill-node';
import { fileURLToPath } from 'url';
import { chunkFileNamesWithExt, entryFileNamesWithExt } from './rollup.utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildPolyfill(input) {
  /** @type {import('rollup').InputPluginOption} */
  const plugins = [
    alias({
      entries: [
        { find: /^(fs|node:fs)(\/.*)?$/, replacement: path.resolve(__dirname, 'src/stub/fs.cjs') },
        { find: 'fs-extra', replacement: path.resolve(__dirname, 'src/stub/fs.cjs') },
        { find: 'debug', replacement: path.resolve(__dirname, 'src/stub/debug.cjs') },
        { find: 'path', replacement: 'path-browserify' },
        { find: /^(node:)?path(\/.*)?$/, replacement: 'path-browserify' },
        { find: 'upath', replacement: 'path-browserify' },
        { find: /^(url|node:url)(\/.*)?$/, replacement: path.resolve(__dirname, 'src/stub/url.cjs') },
        { find: 'crypto', replacement: 'crypto-browserify' }
      ]
    })
  ];

  // TypeScript plugin must come before resolve
  if (input.endsWith('.ts')) {
    plugins.push(
      typescript({
        tsconfig: path.join(__dirname, 'tsconfig.build.json'),
        sourceMap: false,
        declaration: false,
        emitDeclarationOnly: false,
        outDir: undefined // override to avoid Rollup error
      })
    );
  }

  plugins.push(
    polyfillNode(),
    resolve({ preferBuiltins: false, extensions: ['.mjs', '.js', '.json', '.node', '.cjs', '.jsx', '.ts', '.tsx'] }),
    json(),
    commonjs(),
    analyze({ summaryOnly: true })
  );
  const bundle = await rollup({
    input,
    plugins,
    // Browser bundle must inline dependencies to avoid runtime globals like `path$2`.
    external: () => false
  });

  rimraf.sync(path.join(__dirname, 'dist/browser'));

  await bundle.write({
    dir: 'dist/browser',
    format: 'iife',
    entryFileNames: entryFileNamesWithExt('mjs'),
    chunkFileNames: chunkFileNamesWithExt('mjs')
  });
  await bundle.close();
}

async function build() {
  await buildPolyfill(path.join(__dirname, 'src/index-browser.ts'));
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
