const spawn = require('cross-spawn');
const { deepmerge } = require('deepmerge-ts');
const { existsSync, mkdirSync, appendFileSync } = require('fs');
const fs = require('fs-extra');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const gulp = require('gulp');
const { join } = require('upath');

// copy non-javascript assets from src folder
function copyWorkspaceDist(done) {
  const dist = join(__dirname, 'dist');
  // if (fs.existsSync(dist)) fs.emptyDirSync(dist);
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
    //console.log('copying', cwd, '->', dest);
    gulp
      .src(['dist/*.*'], { cwd })
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

function build(done) {
  spawnAsync('npm', ['run', 'build', '--workspaces'], { cwd: __dirname, stdio: 'inherit' }).then(() => done());
}

function eslint(done) {
  spawnAsync('eslint', ['packages/**/src/**/*.{ts,js,json}', '--fix'], { cwd: __dirname }).then(() => done());
}

function buildDist(done) {
  const pkgroot = require('./package.json');
  const pkgmain = require('./packages/sbg-main/package.json');
  const pkgc = deepmerge(pkgroot, pkgmain, { main: 'sbg-main/dist/index.js', types: 'sbg-main/dist/index.d.ts' });
  delete pkgc.workspaces;
  delete pkgc.private;
  pkgc.name = 'static-blog-generator';
  pkgc.description = pkgroot.description;
  pkgc.dependencies = {};
  pkgc.devDependencies = {};
  pkgc.scripts = {};
  pkgc.dependencies['sbg-api'] = 'file:sbg-api';
  pkgc.dependencies['sbg-server'] = 'file:sbg-server';
  pkgc.dependencies['sbg-utility'] = 'file:sbg-utility';
  pkgc.dependencies['sbg-main'] = 'file:sbg-main';
  delete pkgc.files;
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
gulp.task('copy', gulp.series(copyWorkspaceDist));
gulp.task('build', gulp.series(eslint, build, copyWorkspaceDist, buildDist));
gulp.task('default', gulp.series(['build']));

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
