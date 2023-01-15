const path = require('upath');
const glob = require('glob');
const { spawn } = require('git-command-helper/dist/spawn');
const gulp = require('gulp');

const cdir = path.toUnix(__dirname);
const src = path.join(cdir, './source/styles');
const dist = path.join(cdir, './src/public/css');
const scan = glob.sync('**/*.{css,scss,less}', { cwd: src }) || [];
const entries = scan.map((str) => {
  return {
    input: path.join(src, str),
    output: path.join(dist, str)
  };
});

gulp.task('compile:tailwind', async function (done) {
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
    console.log(...args);
    await spawn('npx', args, { cwd: cdir });
  }
  done();
});
