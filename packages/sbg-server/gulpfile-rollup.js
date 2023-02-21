const { rollup } = require('rollup');
const path = require('upath');
const glob = require('glob');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

async function bundleJSRollUp() {
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
    /**
     * @type {import('rollup').RollupOptions}
     */
    const outputOptions = {
      input: entry.input,
      output: {
        name: 'howLongUntilLunch',
        file: entry.output,
        format: 'umd'
      },
      external: [
        'moment',
        'moment-timezone',
        'flowbite',
        'core-js',
        'highlight.js',
        'axios',
        'markdown-it'
      ], // <-- suppresses the warning
      plugins: [
        resolve(), // so Rollup can find `ms`
        commonjs() // so Rollup can convert `ms` to an ES module
      ]
    };
    const bundle = await rollup(outputOptions);
    await bundle.generate();
    try {
      await bundle.write();
    } catch (e) {
      console.log(e.message);
    }
    /*const { output } = await bundle.generate(outputOptions);
    for (const chunkOrAsset of output) {
      if (chunkOrAsset.type === 'asset') {
        console.log('Asset', chunkOrAsset.modules);
      } else {
        console.log('Chunk', chunkOrAsset.modules);
      }
    }*/
  }
}

module.exports = { bundleJSRollUp };
