// const fs = require('fs-extra');
const { spawn } = require('git-command-helper/dist/spawn');
const gulp = require('gulp');
const path = require('upath');
const fs = require('fs-extra');
require('./gulpfile-compile-js.task');

const cmd = (commandName) => {
  const cmdPath = [
    __dirname,
    process.cwd(),
    (process.mainModule || process.main).paths[0].split('node_modules')[0].slice(0, -1)
  ]
    .map((cwd) => {
      const nm = path.join(cwd, 'node_modules/.bin');
      const cmdPath = path.join(nm, commandName);
      return cmdPath;
    })
    .filter(fs.existsSync)[0];

  return process.platform === 'win32' ? cmdPath.replace(/\//g, '\\\\') + '.cmd' : cmdPath;
};

const dist = path.join(__dirname, 'dist');

// copy non-javascript assets from src folder
const copy = function () {
  return gulp
    .src(['**/*.*'], { cwd: path.join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] })
    .pipe(gulp.dest(dist));
};

gulp.task('copy', gulp.series(copy));

function tsc(done) {
  spawn(cmd('tsc'), ['--build', 'tsconfig.build.json'], { cwd: __dirname, shell: true, stdio: 'inherit' })
    .then(() => done())
    .catch(done);
}

gulp.task('clean', (done) => {
  if (fs.existsSync(dist)) {
    fs.emptyDir(dist, done);
  } else done();
});

gulp.task('build', gulp.series('clean', tsc, copy));
