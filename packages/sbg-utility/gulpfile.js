// const fs = require('fs-extra');
const { spawn } = require('git-command-helper/dist/spawn');
const gulp = require('gulp');
const path = require('upath');

// copy non-javascript assets from src folder
const copy = function () {
  return gulp
    .src(['**/*.*'], { cwd: path.join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] })
    .pipe(gulp.dest(path.join(__dirname, 'dist')));
};

gulp.task('copy', gulp.series(copy));

function tsc(done) {
  spawn('tsc', ['--build', 'tsconfig.build.json'], { cwd: __dirname }).then(() => done());
}

gulp.task('build', gulp.series(tsc, copy));
