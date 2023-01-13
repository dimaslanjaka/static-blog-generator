const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const path = require('upath');
const fs = require('fs-extra');
const utility = require('sbg-utility');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack-stream');

const dest = path.join(__dirname, 'src/public');

/**
 * copy font-awesome assets
 * @returns
 */
const copyfa = () =>
  gulp
    .src('./source/styles/fontawesome/**/*.{woff,woff2,eot,svg,otf}', {
      cwd: __dirname
    })
    .pipe(utility.gutils.gulpCached({ name: 'copy-font-awesome' }))
    .pipe(gulp.dest(dest));

/**
 * compile js using webpack
 * @returns
 */
const webpackCompile = () =>
  gulp
    .src('./source/scripts/**/*.js', { cwd: __dirname, ignore: ['**/*.min.js'] })
    .pipe(utility.gutils.gulpCached({ name: 'webpack-compile' }))
    .pipe(sourcemaps.init())
    .pipe(webpack(webpackConfig))
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
gulp.task('compile:js', gulp.series(webpackCompile, copyfa));

// npm run build separated with npm run dev:server
gulp.task('watch', function (done) {
  let indicator = false;
  const doCompile = async (compileDone) => {
    if (indicator) return Promise.resolve(undefined);
    indicator = true;
    try {
      try {
        await spawnAsync('npm', ['run', 'build'], { cwd: __dirname });
      } catch (message) {
        console.log(message);
      }
    } finally {
      indicator = false;
      if (typeof compileDone === 'function') compileDone();
    }
  };

  gulp.series(doCompile)(function () {
    const watcher = gulp.watch(['src/views/**/*.njk', 'source/**/*'], { cwd: __dirname }, doCompile);
    watcher.on('close', () => done());
  });
});
