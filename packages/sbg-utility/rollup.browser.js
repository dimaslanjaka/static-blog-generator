import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';

const plugins = [
  babel({
    babelHelpers: 'bundled',
    extensions: ['.js', '.ts', '.cjs', '.mjs'],
    exclude: '**/node_modules/**',
    presets: ['@babel/preset-typescript']
  }),
  resolve({ browser: true, extensions: ['.mjs', '.js', '.json', '.node', '.cjs', '.jsx', '.ts', '.tsx'] }),
  commonjs()
];

export default [
  {
    input: 'src/index-browser.ts',
    output: {
      file: 'dist/browser/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    plugins
  },
  {
    input: 'src/index-browser.ts',
    output: {
      file: 'dist/browser/index.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins
  },
  // DTS bundles
  {
    input: 'src/index-browser.ts',
    output: {
      file: 'dist/browser/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  },
  {
    input: 'src/index-browser.ts',
    output: {
      file: 'dist/browser/index.d.cts',
      format: 'es'
    },
    plugins: [dts()]
  },
  {
    input: 'src/index-browser.ts',
    output: {
      file: 'dist/browser/index.d.mts',
      format: 'es'
    },
    plugins: [dts()]
  }
];
