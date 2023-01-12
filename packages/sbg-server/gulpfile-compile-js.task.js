const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const terserlib = require('terser');
const sourcemaps = require('gulp-sourcemaps');
const path = require('upath');
const fs = require('fs-extra');
const utility = require('sbg-utility');

const dest = path.join(__dirname, 'src/public');

// copy font-awesome assets
const copyfa = () =>
  gulp
    .src('./source/styles/fontawesome/**/*.{woff,woff2,eot,svg,otf}', {
      cwd: __dirname
    })
    .pipe(utility.gutils.gulpCached())
    .pipe(gulp.dest(dest));

const concatenate = () =>
  gulp
    .src('./source/scripts/**/*.js', { cwd: __dirname, ignore: ['**/*.min.js'] })
    .pipe(concat('app.js'))
    .pipe(utility.gutils.gulpCached())
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

function clean(done) {
  if (fs.existsSync(dest)) {
    fs.emptyDir(dest, done);
  } else {
    done();
  }
}

gulp.task('clean', clean);
gulp.task('compile:js', gulp.series(concatenate, copyfa));
gulp.task('watch', function (done) {
  const watcher = gulp.watch('**/*.njk', { cwd: __dirname + '/src/views' }, gulp.series('compile:js'));
  watcher.on('close', () => done());
});
