const spawn = require('cross-spawn');
const { deepmerge } = require('deepmerge-ts');
const { existsSync, mkdirSync, appendFileSync } = require('fs');
const fs = require('fs-extra');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const gulp = require('gulp');
const { join, toUnix } = require('upath');

// copy dist from all subpackages
function copyWorkspaceDist(done) {
  const dist = join(__dirname, 'dist');
  if (fs.existsSync(dist)) fs.emptyDirSync(dist);
  const packages = {
    'packages/sbg-utility': false,
    'packages/sbg-api': false,
    'packages/sbg-server': false,
    'packages/sbg-main': false
  };
  Object.keys(packages).map((p) => {
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
      .src(['dist/*.*', 'dist/**/*'], { cwd, ignore: ['*.tsbuildinfo'] })
      .pipe(gulp.dest(dest + '/dist'))
      .once('end', () => {
        packages[p] = true;
        //console.log('copying', p, 'end');
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
function eslint(done) {
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
  // delete workspaces property
  delete pkgc.workspaces;
  // delete private property
  delete pkgc.private;
  // replace properties from root properties
  pkgc.name = 'static-blog-generator';
  pkgc.description = pkgroot.description;
  // emptying some properties
  //pkgc.dependencies = {};
  //pkgc.devDependencies = {};
  pkgc.scripts = {};
  // assign sub packages as production dependencies
  pkgc.dependencies['sbg-api'] = 'file:sbg-api';
  pkgc.dependencies['sbg-server'] = 'file:sbg-server';
  pkgc.dependencies['sbg-utility'] = 'file:sbg-utility';
  pkgc.dependencies['sbg-main'] = 'file:sbg-main';
  pkgc.files = ['sbg-*', 'LICENSE', '*.json', '!node_modules'];

  const dest = join(__dirname, 'dist');
  fs.writeFileSync(join(dest, 'package.json'), JSON.stringify(pkgc, null, 2));

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

gulp.task('eslint', gulp.series(eslint));
gulp.task('build-copy', gulp.series(copyWorkspaceDist));
gulp.task('build', gulp.series(build));
gulp.task('build-dist-package', gulp.series(buildDistPackageJson));
gulp.task('build-dist', gulp.series('build', 'build-copy', 'build-dist-package'));
gulp.task('build-all', gulp.series('eslint', 'build-dist'));
gulp.task('default', gulp.series(['build-all']));

/**
 * @type {'false' | 'true' | 'postpone'}
 */
let running = 'false';
const buildNopack = async function () {
  if (/true|postpone/i.test(running)) {
    running = 'postpone';
    return console.log('another build still running');
  }
  if (/false|postpone/i.test(running)) running = 'true';

  const tmp = join(__dirname, 'tmp/gulp/watch');
  if (!existsSync(tmp)) mkdirSync(tmp, { recursive: true });
  const child = spawn('npm', ['run', 'build:nopack'], { cwd: __dirname });

  let data = '';
  for await (const chunk of child.stdout) {
    appendFileSync(join(tmp, 'stdout.txt'), chunk);
    data += chunk;
  }
  let error = '';
  for await (const chunk of child.stderr) {
    appendFileSync(join(tmp, 'stderr.txt'), chunk);
    error += chunk;
  }
  const exitCode = await new Promise((resolve, reject) => {
    child.on('close', resolve);
    child.on('error', reject);
  });

  if (exitCode) {
    console.log(`subprocess error exit ${exitCode}, ${error}`); // throw
  }

  if (running === 'postpone') {
    await buildNopack();
  }
  running = 'false';
  return data;
};
gulp.task('compile', buildNopack);

function buildWatch(done) {
  gulp.series(['compile'])(null);
  const watcher = gulp.watch(
    ['**/*.*', '*.*'],
    {
      ignored: ['**/*.json', '**/dist', '**/release', '**/node_modules', '*.tgz', '**/*.tgz', '**/tmp'],
      cwd: join(__dirname, 'src'),
      delay: 3000
    },
    gulp.series(['compile'])
  );
  watcher.on('change', (filename) => {
    console.log('changed', filename);
    gulp.series(['compile'])(null);
  });
  watcher.on('error', console.log);
  watcher.once('close', done);
}

gulp.task('watch', buildWatch);
