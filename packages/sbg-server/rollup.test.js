const { rollup } = require('rollup');
const fs = require('fs-extra');
const path = require('upath');
const glob = require('glob');
const gulp = require('gulp');
const Bluebird = require('bluebird');
const utility = require('sbg-utility');
const babelCfg = require('./babel.config');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const createWriteStream = (p) => {
  if (!fs.existsSync(path.dirname(p)))
    fs.mkdirSync(path.dirname(p), { recursive: true });
  return fs.createWriteStream(p);
};

const src = path.join(__dirname, './source/scripts');
const dist = path.join(__dirname, './src/public/js');
const scan = glob.sync('**/*.js', { cwd: src }) || [];
const entries = scan.map((str) => {
  return {
    input: path.join(src, str),
    output: path.join(dist, str)
  };
});

for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  console.log(entry);
  const bundle = rollup({
    input: entry.input,
    output: {
      name: 'howLongUntilLunch',
      file: entry.output,
      format: 'umd'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs() // so Rollup can convert `ms` to an ES module
    ]
  });
}
