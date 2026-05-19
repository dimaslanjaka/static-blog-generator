import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import { rollup } from 'rollup';
import analyze from 'rollup-plugin-analyzer';
import { dts } from 'rollup-plugin-dts';
import polyfillNode from 'rollup-plugin-polyfill-node';
import { fileURLToPath } from 'url';
import { chunkFileNamesWithExt } from './rollup.utils.js';

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
        tsconfig: path.join(__dirname, 'tsconfig.browser.json'),
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

  await bundle.write({
    dir: 'dist/browser',
    format: 'iife',
    // entryFileNames: entryFileNamesWithExt('mjs'),
    entryFileNames: 'index.mjs',
    chunkFileNames: chunkFileNamesWithExt('mjs')
  });

  await bundle.write({
    dir: 'dist/browser',
    format: 'iife',
    // entryFileNames: entryFileNamesWithExt('mjs'),
    entryFileNames: 'index.cjs',
    chunkFileNames: chunkFileNamesWithExt('mjs')
  });
  await bundle.close();
}

async function buildTypes(input) {
  const bundle = await rollup({
    input,
    plugins: [dts()],
    // Keep third-party types external and generate only package declaration surface.
    external: [/^node:/, /^[a-zA-Z0-9@][^:]*$/]
  });

  await bundle.write({
    file: 'dist/browser/index.d.ts',
    format: 'es'
  });
  await bundle.close();
}

async function build() {
  const browserEntry = path.join(__dirname, 'src/index-browser.ts');
  await buildPolyfill(browserEntry);
  await buildTypes(browserEntry);
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
