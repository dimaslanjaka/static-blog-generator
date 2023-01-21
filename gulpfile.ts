import Bluebird from 'bluebird';
import fs from 'fs-extra';
import { spawnAsync } from 'git-command-helper/dist/spawn';
import gulp from 'gulp';
import { join, resolve as resolvePath, toUnix } from 'upath';
import { checkPacked } from './check-packed.js';

gulp.task('check-dist', () => checkPacked(__dirname + '/dist'));
gulp.task('check-root', () => checkPacked(__dirname + '/dist', join(__dirname, 'tmp/packed.txt')));

const packages = {
  'packages/sbg-utility': false,
  'packages/sbg-api': false,
  'packages/sbg-server': false,
  'packages/sbg-main': false,
  'packages/safelinkify': false,
  'packages/hexo-post-parser': false,
  'packages/git-command-helper': false
};

gulp.task('pre-install-dist', function (done) {
  const list = Object.keys(packages);
  const listDistPath = list.map((p) => {
    return {
      absolutePath: join(__dirname, 'dist', p),
      packagejson: join(__dirname, 'dist', p, 'package.json'),
      parsedPackageJson: JSON.parse(
        fs.readFileSync(join(__dirname, 'dist', p, 'package.json'), 'utf-8')
      ) as typeof import('./package.json')
    };
  });
  for (let i = 0; i < listDistPath.length; i++) {
    const lib = listDistPath[i];
    const filterLocalPkg = Object.keys(lib.parsedPackageJson.dependencies).filter(
      (str) =>
        str.startsWith('sbg') || ['git-command-helper', 'safelinkify', 'hexo-post-parser'].some((pkg) => str === pkg)
    );
    console.log(filterLocalPkg);
  }
  done();
});

gulp.task('install-dist', function (done) {
  Bluebird.all(Object.keys(packages))
    .each((pkg) => {
      const pkgPath = resolvePath(__dirname, 'dist', pkg);
      console.log('installing', pkgPath);
      return spawnAsync('npm', ['run', 'update'], { cwd: pkgPath, stdio: 'inherit' });
    })
    .then(() => {
      const pkgPath = resolvePath(__dirname, 'dist');
      console.log('installing', pkgPath);
      return spawnAsync('npm', ['run', 'update'], { cwd: pkgPath, stdio: 'inherit' });
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
function copyWorkspaceDist(done: gulp.TaskFunctionCallback) {
  const dist = join(__dirname, 'dist');
  /**
   * @type {Record<string, boolean>}
   */
  const streams: Record<string, boolean> = {};
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
        if (Object.values(streams).length === Object.keys(packages).length) {
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
function build(done: gulp.TaskFunctionCallback) {
  spawnAsync('npm', ['run', 'build', '--workspaces'], { cwd: __dirname, stdio: 'inherit' }).then(() => done());
}

/**
 * fix eslint all src folder subpackages
 * @param {gulp.TaskFunctionCallback} done
 */
function runEslint(done: gulp.TaskFunctionCallback) {
  spawnAsync('eslint', ['packages/**/src/**/*.{ts,js,json}', '--fix'], { cwd: __dirname }).then(() => done());
}

/**
 * build dist package.json
 * @param {gulp.TaskFunctionCallback} done
 */
async function buildPack(done: gulp.TaskFunctionCallback) {
  const pkgc = await import('./package.json');

  const dest = join(__dirname, 'dist');

  await spawnAsync('npm', ['pack'], {
    cwd: dest,
    stdio: 'inherit'
  });
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
}

gulp.task('lint', runEslint);
gulp.task('build-copy', copyWorkspaceDist);
gulp.task('build', build);
gulp.task('build-pack', buildPack);
gulp.task('build-dist', gulp.series('build', 'build-copy', 'install-dist', 'build-pack'));
gulp.task('build-all', gulp.series('lint', 'build-dist'));
gulp.task('build-clean', gulp.series('clean', 'build-dist'));
gulp.task('default', gulp.series(['build-dist']));
