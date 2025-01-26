import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as glob from 'glob';
import path from 'path';
import { dts } from 'rollup-plugin-dts';
import { fileURLToPath } from 'url';
import { external, tsconfig } from './rollup.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('rollup').RollupOptions['input']}
 */
const inputs = glob.globSync('src/**/*.{ts,js,cjs,mjs}', {
  posix: true,
  // ignore non-production files
  ignore: tsconfig.exclude.concat(
    '**/*.runner.*',
    '**/*.explicit.*',
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.builder.*',
    '**/*.d.ts'
  )
});

const plugins = [
  resolve({ preferBuiltins: true }), // Resolve node_modules packages
  commonjs(), // Convert CommonJS modules to ES6
  typescript({
    tsconfig: false,
    compilerOptions: tsconfig.compilerOptions,
    include: ['./src/**/*'],
    exclude: tsconfig.exclude.concat('**/*.test.*', '**/*.builder.*'),
    resolveJsonModule: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    allowJs: true,
    checkJs: false,
    downlevelIteration: true
  }) // Compile TypeScript files
];

/**
 * @type {import('rollup').RollupOptions}
 */
const _partials = {
  input: inputs,
  output: [
    // bundle .js as ESM
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      globals: {
        hexo: 'hexo'
      }
    },
    // bundle .cjs as CommonJS
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
    // build .mjs as ESM
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
      exports: 'named'
    },
    // bundle .cjs as CommonJS
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: false,
      globals: {
        hexo: 'hexo'
      },
      exports: 'named'
    },
    // build .mjs as ESM
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: false,
      globals: {
        hexo: 'hexo'
      },
      exports: 'named'
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
  output: [{ file: './dist/index.d.ts', format: 'es' }],
  plugins: [resolve({ preferBuiltins: true }), dts()]
};

export default [declaration, _onefile, _partials];
