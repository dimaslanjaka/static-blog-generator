const path = require('upath');
const glob = require('glob');
const { spawnAsync } = require('cross-spawn');
const fs = require('fs');

const cdir = path.toUnix(__dirname);
const src = path.join(cdir, './source/styles');
const dist = path.join(cdir, './src/public/css');
if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });
const scan = glob.sync('**/*.{css,scss,less}', { cwd: src }) || [];
const entries = scan.map((str) => {
  return {
    input: path.join(src, str),
    output: path.join(dist, str)
  };
});

async function bundleCSS(done) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const input = '.' + entry.input.replace(cdir, '');
    const output = '.' + entry.output.replace(cdir, '');
    // tailwind -c tailwind.config.js -i source/styles/app.css -o ./src/public/css/app.css
    const args = [
      'tailwind',
      '-c',
      'tailwind.config.js',
      '-i',
      input,
      '-o',
      output
    ];
    console.log(args[0], ...args.slice(1));
    await spawnAsync(args[0], args.slice(1), {
      cwd: cdir,
      stdio: 'inherit',
      shell: true
    });
  }
  if (typeof done === 'function') done();
}

module.exports = { bundleCSS };

if (require.main === module) {
  // call when runned directly
  bundleCSS();
}
