const { deepmerge } = require('deepmerge-ts');
const fs = require('fs-extra');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const gulp = require('gulp');
const { join, toUnix, resolve: resolvePath } = require('upath');
const Bluebird = require('bluebird');

/**
 * dump list files from `npm pack`
 * @see {@link https://www.webmanajemen.com/NodeJS/snippet/get-list-files-from-npm-pack.html}
 * @param {string} cwd
 */
async function checkPacked(cwd) {
  const result = await spawnAsync('npm', ['pack', '--json', '--dry-run'], { cwd });
  const parse = JSON.parse(result.stdout)[0];
  const { files } = parse;
  // uncomment for log to file
  //const output = join(__dirname, 'tmp/listpack.txt');
  //writeFileSync(output, files.map((o) => o && o.path).join('\n'));
  //console.log(output);
  console.log(files);
}

gulp.task('check-dist', () => checkPacked(__dirname + '/dist'));

const packages = {
  'packages/sbg-utility': false,
  'packages/sbg-api': false,
  'packages/sbg-server': false,
  'packages/sbg-main': false
};

gulp.task('clean', function (done) {
  Bluebird.all(Object.keys(packages))
    .each((pkg) => {
      const source_dist = resolvePath(join(__dirname, pkg, 'dist'));
      const production_dist = resolvePath(join(__dirname, 'dist', pkg.split('/')[1]));
      console.log(
        'emptying',
        source_dist.replace(toUnix(__dirname), ''),
        production_dist.replace(toUnix(__dirname), '')
      );
      return Bluebird.all([fs.emptyDir(source_dist), fs.emptyDir(production_dist)]);
    })
    .then(() => done());
});

/**
 * copy all <package>/dist to /dist/<package>/dist
 * @param {gulp.TaskFunctionCallback} done
 */
function copyWorkspaceDist(done) {
  const dist = join(__dirname, 'dist');
  Bluebird.all(packages).map((p) => {
    const cwd = join(__dirname, p);
    const dest = join(dist, p.replace('packages/', ''));
    const pkj = join(__dirname, p, 'package.json');
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    } else {
      fs.emptyDirSync(dest);
    }

    fs.copyFileSync(pkj, join(dest, 'package.json'));
    console.log('copying', cwd.replace(toUnix(__dirname), ''), '->', dest.replace(toUnix(__dirname), ''));
    gulp
      .src(['dist/*.*', 'dist/**/*'], { cwd, ignore: ['**/*.tsbuildinfo'] })
      .pipe(gulp.dest(dest + '/dist'))
      .once('end', () => {
        packages[p] = true;
        console.log('copying', p, 'end');
        if (Object.values(packages).every(Boolean)) done();
      })
      .once('error', () => {
        packages[p] = true;
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
function buildDistPackageJson(done) {
  const pkgroot = require('./package.json');
  const pkgmain = require('./packages/sbg-main/package.json');
  const pkgc = deepmerge(pkgroot, pkgmain, { main: 'sbg-main/dist/index.js', types: 'sbg-main/dist/index.d.ts' });

  const dest = join(__dirname, 'dist');

  spawnAsync('npm', ['pack'], {
    cwd: dest
  }).then(() => {
    // copy files
    fs.copyFileSync(join(__dirname, 'readme.md'), join(dest, 'readme.md'));
    fs.copyFileSync(join(__dirname, 'LICENSE'), join(dest, 'LICENSE'));
    // packing to release
    const filepack = `${pkgc.name}-${pkgc.version}.tgz`;
    fs.copyFileSync(join(dest, filepack), join(__dirname, 'release', filepack));
    fs.copyFileSync(join(dest, filepack), join(__dirname, 'release', `${pkgc.name}.tgz`));
    fs.rmSync(join(dest, filepack));
    done();
  });
}

gulp.task('lint', runEslint);
gulp.task('build-copy', copyWorkspaceDist);
gulp.task('build', build);
gulp.task('build-dist-package', gulp.series(buildDistPackageJson));
gulp.task('build-dist', gulp.series('build', 'build-copy', 'build-dist-package'));
gulp.task('build-all', gulp.series('lint', 'build-dist'));
gulp.task('default', gulp.series(['build-dist']));
