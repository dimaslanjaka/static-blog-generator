const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const terserlib = require('terser');
const sourcemaps = require('gulp-sourcemaps');
const path = require('upath');
const fs = require('fs-extra');

const dest = path.join(__dirname, 'src/public');
if (fs.existsSync(dest)) fs.emptyDirSync(dest);

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
  .pipe(gulp.dest(dest + '/js'));

// copy font-awesome assets
gulp
  .src('./source/styles/fontawesome/**/*.*', {
    cwd: __dirname,
    ignore: ['**/*.{scss,less,md,zip,json,zip,map,css,js,yml}']
  })
  .pipe(gulp.dest(dest));
