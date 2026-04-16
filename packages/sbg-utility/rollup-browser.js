import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as glob from 'glob';
import path from 'path';
import { rollup } from 'rollup';
import analyze from 'rollup-plugin-analyzer';
import polyfillNode from 'rollup-plugin-polyfill-node';
import { fileURLToPath } from 'url';
import { chunkFileNamesWithExt, entryFileNamesWithExt, externalPackages } from './rollup.utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildPolyfill(input) {
  const plugins = [
    alias({
      entries: [
        { find: 'path', replacement: 'path-browserify' },
        { find: 'upath', replacement: 'path-browserify' },
        { find: 'fs', replacement: path.resolve(__dirname, 'src/stub/fs.cjs') },
        { find: 'fs-extra', replacement: path.resolve(__dirname, 'src/stub/fs.cjs') },
        { find: 'crypto', replacement: 'crypto-browserify' }
      ]
    }),
    polyfillNode(),
    resolve({ preferBuiltins: true, extensions: ['.mjs', '.js', '.json', '.node', '.cjs', '.jsx', '.ts', '.tsx'] })
  ];
  if (input.endsWith('.ts')) {
    plugins.push(typescript({ tsconfig: './tsconfig.build.json', sourceMap: false }));
  }
  plugins.push(json(), commonjs(), analyze({ summaryOnly: true }));
  const bundle = await rollup({
    input,
    plugins,
    external: externalPackages
  });

  await bundle.write({
    dir: 'dist/browser',
    format: 'iife',
    entryFileNames: entryFileNamesWithExt('mjs'),
    chunkFileNames: chunkFileNamesWithExt('mjs')
  });
  await bundle.close();
}

// glob
//   .sync('**/*.{ts,cjs,mjs}', { cwd: 'tmp/dist', absolute: true, ignore: ['**/*.builder.*', '**/*.d.{ts,cts,mts}'] })
//   .forEach((file) => {
//     buildPolyfill(file).catch((err) => {
//       console.error('Build failed:', err);
//       process.exit(1);
//     });
//   });

glob
  .sync('**/*.{ts,cjs,mjs}', { cwd: 'src', absolute: true, ignore: ['**/*.builder.*', '**/*.d.{ts,cts,mts}'] })
  .forEach((file) => {
    buildPolyfill(file).catch((err) => {
      console.error('Build failed:', err);
      process.exit(1);
    });
  });
