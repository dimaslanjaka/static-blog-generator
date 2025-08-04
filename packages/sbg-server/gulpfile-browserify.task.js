const browserify = require('browserify');
const path = require('upath');
const glob = require('glob');
const Bluebird = require('bluebird');
const utility = require('sbg-utility');

const createWriteStream = utility.createWriteStream;

const src = path.join(__dirname, './source/scripts');
const dist = path.join(__dirname, './src/public/js');
const scan = glob.sync('**/*.js', { cwd: src }) || [];
const entries = scan.map((str) => {
  return {
    input: path.join(src, str),
    output: path.join(dist, str)
  };
});

const bundleJSWithBrowserify = (done) => {
  const bundler = (entry) =>
    new Bluebird((resolve) => {
      browserify(entry.input, {
        detectGlobals: true,
        bundleExternal: true
      })
        .transform('babelify', {
          extends: path.join(__dirname, '../../babel.config.js'),
          global: true,
          presets: ['@babel/preset-env']
        })
        .bundle()
        .pipe(createWriteStream(entry.output))
        .once('finish', () => resolve());
    });

  const callbacks = [];

  // push bundler
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    callbacks.push({ callback: () => bundler(entry) });
  }
  // push finish gulp task
  callbacks.push({ callback: done });

  return utility.chain(callbacks);
};

module.exports = { bundleJSWithBrowserify };
