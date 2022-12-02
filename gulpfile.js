const typedoc = require('gulp-typedoc');
const gulp = require('gulp');
const typedocOptions = require('./typedoc-config');

gulp.task('typedoc', function () {
  return gulp.src(['src/*.ts'], { cwd: __dirname }).pipe(typedoc(typedocOptions));
});
