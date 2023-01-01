const gulp = require('gulp');
const { publish } = require('./typedoc-runner');

gulp.task('docs', function (done) {
  publish({ cleanOutputDir: false }, () => done());
});
