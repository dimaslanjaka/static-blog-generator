const gulp = require('gulp');
const path = require('upath');
const fs = require('fs-extra');
const utility = require('sbg-utility');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const spawn = require('child_process').spawn;
const kill = require('tree-kill');
const through2 = require('through2');
const sharp = require('sharp');
require('./gulpfile-browserify.task');
require('./gulpfile-tailwind.task');

const cmd = (commandName) => {
  const cmdPath = [
    __dirname,
    process.cwd(),
    (process.mainModule || process.main).paths[0]
      .split('node_modules')[0]
      .slice(0, -1)
  ]
    .map((cwd) => {
      const nm = path.join(cwd, 'node_modules/.bin');
      const cmdPath = path.join(nm, commandName);
      return cmdPath;
    })
    .filter(fs.existsSync)[0];

  return process.platform === 'win32'
    ? cmdPath.replace(/\//g, '\\\\') + '.cmd'
    : cmdPath;
};

/**
 * copy non-javascript assets from src folder to dist
 * @returns
 */
const copyNonJS = () =>
  gulp
    .src(['**/*.*'], {
      cwd: path.join(__dirname, 'src'),
      ignore: ['**/*.{ts,js,json}']
    })
    .pipe(gulp.dest(path.join(__dirname, 'dist')));
/**
 * copy src/public to dist/public
 * @returns
 */
const copyPublic = () =>
  gulp
    .src(['**/*.*'], {
      cwd: path.join(__dirname, 'src/public')
    })
    .pipe(gulp.dest(path.join(__dirname, 'dist/public')));

gulp.task('copy', gulp.series(copyPublic, copyNonJS));

function tsc(done) {
  spawnAsync(cmd('tsc'), ['--build', 'tsconfig.build.json'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  })
    .then(() => done())
    .catch(done);
}

gulp.task('build', gulp.series(tsc, 'copy'));

// dev
const pids = [];
/** @type {import('child_process').ChildProcess[]} */
const childs = [];
const killPids = function () {
  for (let i = 0; i < pids.length; i++) {
    const pid = pids[i];
    try {
      kill(pid);
      // process.kill(-pid);
      // const index = pids.indexOf(pid);
      // if (index !== -1) pids.splice(index, 1);
    } catch (e) {
      console.log(String(e));
      console.log('pid', pid, 'not found');
    }
  }
};

const startServer = function (done) {
  killPids();

  const child = spawn('npm', ['run', 'dev:server'], {
    cwd: __dirname,
    shell: true,
    detached: true
  });
  child.once('exit', (code, signal) => {
    console.log('subprocess', child.pid, 'exit', { code, signal });
  });
  pids.push(child.pid);
  childs.push(child);
  typeof done === 'function' && done();
};

gulp.task('compile:css', async function (done) {
  await spawnAsync('npm', ['run', 'tw'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  await spawnAsync('npm', ['run', 'purge'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  typeof done === 'function' && done();
});

gulp.task('compile:images', function () {
  return gulp
    .src(['**/*'], { cwd: __dirname + '/source/images' })
    .pipe(
      through2.obj(async function (file, _enc, next) {
        if (file.isNull() || file.isStream() || file.isDirectory())
          return next();
        if (/.(svg|jpe?g|png)$/gim.test(file.extname)) {
          file.contents = await sharp(file.contents).webp().toBuffer();
          file.extname = '.webp';
          next(null, file);
        } else {
          next();
        }
      })
    )
    .pipe(gulp.dest('src/public/images'));
});

gulp.task(
  'compile',
  gulp.series('compile:css', 'compile:images', 'compile:js')
);

gulp.task('watch', function (done) {
  [
    gulp.watch(
      '**/*',
      { cwd: __dirname + '/src/views' },
      gulp.series('compile:css')
    ),
    gulp.watch(
      'scripts/**/*',
      { cwd: __dirname + '/source' },
      gulp.series('compile:js')
    ),
    gulp.watch(
      'libs/**/*',
      { cwd: __dirname + '/source' },
      gulp.series('compile:js', 'compile:css')
    ),
    gulp.watch(
      'libs/**/*',
      { cwd: __dirname + '/source' },
      gulp.series('compile:images')
    ),
    gulp.watch(
      'styles/**/*',
      { cwd: __dirname + '/source' },
      gulp.series('compile:css')
    ),
    gulp.watch(
      '**/*.ts',
      {
        ignored: ['**/public/**'],
        cwd: __dirname + '/src'
      },
      gulp.series(startServer)
    )
  ].forEach((p) => {
    p.once('close', () => done());
  });
  gulp.parallel(
    'compile:js',
    'compile:css',
    'compile:images',
    startServer
  )(null);
});

process.on('SIGTERM', function () {
  console.info('SIGTERM signal received.');
  killPids();
  return this;
});
process.on('SIGHUP', function () {
  console.log('SIGHUP signal received');
  killPids();
  return this;
});
process.on('exit', function () {
  killPids();
  return this;
});
process.on('SIGINT', function () {
  console.log('SIGINT signal received');
  killPids();
  process.exit(1);
});
