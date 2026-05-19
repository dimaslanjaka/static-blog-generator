import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import color from 'ansi-colors';
import fs from 'fs';
import * as glob from 'glob';
import path from 'upath';
import { bundledPackages, externalPackages } from './rollup.utils.js';

const INPUT_RAW = process.env.ROLLUP_INPUT;
if (!INPUT_RAW) {
  console.error(color.red('Error: ROLLUP_INPUT environment variable is not set.'));
  process.exit(1);
}

if (!process.env.ROLLUP_OUTPUT) {
  // get dirname and basename without extension
  const dir = path.dirname(INPUT_RAW);
  const ext = path.extname(INPUT_RAW);
  const baseName = path.basename(INPUT_RAW, ext);
  process.env.ROLLUP_OUTPUT = path.join(dir, baseName + '.cjs');
  console.log(`Set ROLLUP_OUTPUT to: ${process.env.ROLLUP_OUTPUT}`);
}

const OUTPUT_BASE = process.env.ROLLUP_OUTPUT.replace(/\.(cjs|mjs|js)$/, '');

console.log(`Input: ${color.cyan(INPUT_RAW)}`);
console.log(`Output: ${color.cyan(OUTPUT_BASE)}.mjs and ${color.cyan(OUTPUT_BASE)}.cjs`);

/* ----------------------------
   INPUT NORMALIZATION (FIXED)
----------------------------- */
function normalize(p) {
  return path.toUnix(p);
}

function resolveInputs(input) {
  const normalized = normalize(input);

  // If it's a direct file (not glob), still support it
  const isFile = fs.existsSync(normalized) && fs.statSync(normalized).isFile();

  const results = isFile ? [normalized] : glob.sync(normalized, { nodir: true }).map(normalize);

  if (!results.length) {
    throw new Error(`No inputs found for: ${input}`);
  }

  return results;
}

const inputs = resolveInputs(INPUT_RAW);
const hasTypeScript = inputs.some((f) => f.endsWith('.ts'));

/* ----------------------------
   FILE NAME HELPERS
----------------------------- */
function entryFileNamesWithExt(ext) {
  return ({ facadeModuleId }) => {
    facadeModuleId = path.toUnix(facadeModuleId);

    if (!facadeModuleId.includes('node_modules')) {
      return `[name].${ext}`;
    }

    const idx = facadeModuleId.indexOf('node_modules');
    let rel = facadeModuleId.slice(idx);

    rel = rel
      .replace('node_modules', 'dependencies')
      .slice(0, -path.extname(rel).length)
      .replace(/\0/g, '')
      .replace(/^\/\/+/, '');

    return `${rel}.${ext}`;
  };
}

function chunkFileNamesWithExt(ext) {
  return ({ name }) => {
    if (name && name.includes('node_modules')) {
      const idx = name.indexOf('node_modules');
      let rel = name.slice(idx);

      rel = rel
        .replace('node_modules', 'dependencies')
        .slice(0, -path.extname(rel).length)
        .replace(/\0/g, '')
        .replace(/^\/\/+/, '');

      return `${rel}-[hash].${ext}`;
    }

    return `[name]-[hash].${ext}`;
  };
}

/* ----------------------------
   EXTERNAL FILTER
----------------------------- */
function externalPackagesFilter(source) {
  const pkgName = source.split('/')[0];

  if (bundledPackages.includes(pkgName)) return false;
  if (externalPackages.includes(pkgName)) return true;

  return false;
}

/* ----------------------------
   PLUGINS
----------------------------- */
const plugins = [
  nodeResolve({
    extensions: ['.js', '.ts', '.cjs', '.mjs', '.json', '.node'],
    preferBuiltins: true
  }),
  commonjs({
    transformMixedEsModules: true
  }),
  json()
];

if (hasTypeScript) {
  plugins.push(
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.ts', '.cjs', '.mjs'],
      exclude: '**/node_modules/**',
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            targets: { node: '14' }
          }
        ]
      ]
    })
  );
}

/* ----------------------------
   ROLLUP CONFIG
----------------------------- */
export default {
  input: inputs,

  external: externalPackagesFilter,
  plugins,

  output: [
    {
      format: 'esm',
      file: `${OUTPUT_BASE}.mjs`,
      entryFileNames: entryFileNamesWithExt('mjs'),
      chunkFileNames: chunkFileNamesWithExt('mjs')
    },
    {
      format: 'cjs',
      file: `${OUTPUT_BASE}.cjs`,
      entryFileNames: entryFileNamesWithExt('cjs'),
      chunkFileNames: chunkFileNamesWithExt('cjs')
    }
  ]
};
