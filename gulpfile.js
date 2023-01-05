const { spawn } = require('git-command-helper/dist/spawn');
const gulp = require('gulp');
const { join } = require('path');
const { publish } = require('./typedoc-runner');

gulp.task('docs', function (done) {
  publish({ cleanOutputDir: false }, () => done());
});

gulp.task('build', function () {
  return spawn('ts-node', ['build.ts'], { cwd: __dirname });
});

gulp.task('watch', function () {
  return gulp.series('build')(() =>
    gulp.watch('**/*.*', { cwd: join(__dirname, 'src') }, gulp.series('build'))
  );
});
