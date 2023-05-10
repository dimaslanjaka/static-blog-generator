// const fs = require('fs-extra');
const { spawnAsync } = require('cross-spawn');
const gulp = require('gulp');
const path = require('upath');
const fs = require('fs-extra');

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

// copy non-javascript assets from src folder
const copy = function () {
  return gulp
    .src(['**/*.*'], { cwd: path.join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] })
    .pipe(gulp.dest(path.join(__dirname, 'dist')));
};

gulp.task('copy', gulp.series(copy));

function tsc(done) {
  spawnAsync(cmd('tsc'), ['--build', 'tsconfig.build.json'], { cwd: __dirname, shell: true, stdio: 'inherit' })
    .then(() => done())
    .catch(done);
}

gulp.task('build', gulp.series(tsc, copy));
