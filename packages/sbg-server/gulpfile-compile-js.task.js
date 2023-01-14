const gulp = require('gulp');
const path = require('upath');
const fs = require('fs-extra');
const utility = require('sbg-utility');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const { spawnAsync } = require('git-command-helper/dist/spawn');

// dest folder
const dest = path.join(__dirname, 'src/public');

/**
 * copy font-awesome assets
 * @returns
 */
const copyfa = () =>
  gulp
    .src('./source/libs/fontawesome/**/*.{woff,woff2,eot,svg,otf,ttf}', {
      cwd: __dirname
    })
    .pipe(utility.gutils.gulpCached({ name: 'copy-font-awesome' }))
    .pipe(gulp.dest(dest));

/**
 * compile js using webpack
 * @returns
 */
gulp.task('compile:webpack', (done) => {
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(stats.toString({ colors: true }));
      done();
    } else {
      console.log(stats.toString({ colors: true }));
      done();
    }
  });
});

function clean(done) {
  if (fs.existsSync(dest)) {
    fs.emptyDir(dest, done);
  } else {
    done();
  }
}

gulp.task('clean', clean);
gulp.task('compile:js', gulp.series('compile:webpack', copyfa));

// npm run build separated with npm run dev:server
gulp.task('watch', function (done) {
  let indicator = false;
  const doCompile = async (compileDone) => {
    if (indicator) return;
    indicator = true;
    try {
      await spawnAsync('npm', ['run', 'terser'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      await spawnAsync('npm', ['run', 'tw'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      await spawnAsync('npm', ['run', 'purge'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
    } catch (message) {
      console.log(message);
    } finally {
      if (typeof compileDone === 'function') compileDone();
    }
  };

  gulp.series(doCompile)(function () {
    const watcher = gulp.watch(
      ['src/views/**/*.{njk,html}', 'source/**/*'],
      { cwd: __dirname },
      gulp.series(doCompile)
    );
    watcher.on('close', () => done());
  });
});
