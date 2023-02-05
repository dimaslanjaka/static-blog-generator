const browserify = require('browserify');
const fs = require('fs-extra');
const path = require('upath');
const glob = require('glob');

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
    .pipe(createWriteStream(entry.output));
}
