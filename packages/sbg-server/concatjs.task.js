const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const terserlib = require('terser');
const sourcemaps = require('gulp-sourcemaps');

gulp
  .src('./source/scripts/**/*.js', { cwd: __dirname, ignore: ['**/*.min.js'] })
  .pipe(concat('app.js'))
  .pipe(sourcemaps.init())
  .pipe(
    terser(
      {
        keep_fnames: true,
        mangle: false
      },
      terserlib.minify
    )
  )
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./src/public/'));
