const fs = require('fs-extra');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const gulp = require('gulp');
const { join, toUnix, resolve: resolvePath } = require('upath');
const Bluebird = require('bluebird');
const { checkPacked } = require('./check-packed.js');

gulp.task('check-dist', () => checkPacked(__dirname + '/dist'));
gulp.task('check-root', () => checkPacked(__dirname + '/dist'), join(__dirname, 'tmp/packed.txt'));

const packages = {
  'packages/sbg-utility': false,
  'packages/sbg-api': false,
  'packages/sbg-server': false,
  'packages/sbg-main': false
};

gulp.task('install-dist', function (done) {
  Bluebird.all(Object.keys(packages))
    .each((pkg) => {
      const pkgPath = resolvePath(__dirname, 'dist', pkg);
      console.log('installing', pkgPath);
      return spawnAsync('npm', ['install'], { cwd: pkgPath, stdio: 'inherit' });
    })
    .then(() => {
      const pkgPath = resolvePath(__dirname, 'dist');
      console.log('installing', pkgPath);
      return spawnAsync('npm', ['install'], { cwd: pkgPath, stdio: 'inherit' });
    })
    .then(() => done());
});

// emptying all dist/<package>, packages/<package>/dist
gulp.task('clean', function (done) {
  Bluebird.all(Object.keys(packages))
    .each((pkg) => {
      const source_dist = resolvePath(join(__dirname, pkg, 'dist'));
      const source_tmp = resolvePath(join(__dirname, pkg, 'tmp'));
      const production_dist = resolvePath(join(__dirname, 'dist', pkg));
      console.log(
        'emptying',
        source_dist.replace(toUnix(__dirname), ''),
        source_tmp.replace(toUnix(__dirname), ''),
        production_dist.replace(toUnix(__dirname), '')
      );
      return Bluebird.all([fs.emptyDir(source_dist), fs.emptyDir(production_dist), fs.emptyDir(source_tmp)]);
    })
    .then(() => done());
});

/**
 * copy all <package>/dist to /dist/<package>/dist
 * @param {gulp.TaskFunctionCallback} done
 */
function copyWorkspaceDist(done) {
  const dist = join(__dirname, 'dist');
  /**
   * @type {Record<string, boolean>}
   */
  const streams = {};
  Bluebird.all(Object.keys(packages)).map((p) => {
    const cwd = join(__dirname, p);
    const dest = join(dist, p);
    const pkj = join(__dirname, p, 'package.json');
    // mkdir /dist/<package>
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    // copy /packages/<package>/package.json to /dist/<package>/
    fs.copyFileSync(pkj, join(dest, 'package.json'));
    console.log('copying', cwd.replace(toUnix(__dirname), ''), '->', dest.replace(toUnix(__dirname), ''));
    // copy dist files to /dist/<package>/dist
    gulp
      .src(['dist/*.*', 'dist/**/*'], { cwd, ignore: ['**/*.tsbuildinfo'] })
      .pipe(gulp.dest(dest + '/dist'))
      .once('end', () => {
        streams[p] = true;
        console.log('copying', p, 'end');
        if (Object.values(streams).length === 4) {
          if (Object.values(streams).every((value) => value === true)) done();
        } else {
          //
        }
      })
      .once('error', () => {
        streams[p] = true;
        console.log('copying', p, 'error');
      });
  });
}

/**
 * npm run build --workspaces
 * @param {gulp.TaskFunctionCallback} done
 */
function build(done) {
  spawnAsync('npm', ['run', 'build', '--workspaces'], { cwd: __dirname, stdio: 'inherit' }).then(() => done());
}

/**
 * fix eslint all src folder subpackages
 * @param {gulp.TaskFunctionCallback} done
 */
function runEslint(done) {
  spawnAsync('eslint', ['packages/**/src/**/*.{ts,js,json}', '--fix'], { cwd: __dirname }).then(() => done());
}

/**
 * build dist package.json
 * @param {gulp.TaskFunctionCallback} done
 */
function buildPack(done) {
  const pkgc = require('./package.json');

  const dest = join(__dirname, 'dist');

  spawnAsync('npm', ['pack'], {
    cwd: dest,
    stdio: 'inherit'
  }).then(() => {
    // copy files
    fs.copyFileSync(join(__dirname, 'readme.md'), join(dest, 'readme.md'));
    fs.copyFileSync(join(__dirname, 'LICENSE'), join(dest, 'LICENSE'));
    // packing to release
    const packageName = pkgc.name;
    const filepack = `${packageName}-${pkgc.version}.tgz`;
    fs.copyFileSync(join(dest, filepack), join(__dirname, 'release', filepack));
    fs.copyFileSync(join(dest, filepack), join(__dirname, 'release', `${packageName}.tgz`));
    fs.rmSync(join(dest, filepack));
    done();
  });
}

gulp.task('lint', runEslint);
gulp.task('build-copy', copyWorkspaceDist);
gulp.task('build', build);
gulp.task('build-pack', buildPack);
gulp.task('build-dist', gulp.series('build', 'build-copy', 'install-dist', 'build-pack'));
gulp.task('build-all', gulp.series('lint', 'build-dist'));
gulp.task('build-clean', gulp.series('clean', 'build-dist'));
gulp.task('default', gulp.series(['build-dist']));
