const gulp = require('gulp');
const path = require('upath');
const fs = require('fs-extra');
const utility = require('sbg-utility');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const spawn = require('child_process').spawn;
const kill = require('tree-kill');
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

// dest folder
const dist = path.join(__dirname, 'src/public');

/**
 * copy font-awesome assets
 * @returns
 */
gulp.task('copy:fa', function () {
  return gulp
    .src('./source/libs/fontawesome/**/*.{woff,woff2,eot,svg,otf,ttf}', {
      cwd: __dirname
    })
    .pipe(utility.gutils.gulpCached({ name: 'copy-font-awesome' }))
    .pipe(gulp.dest(dist));
});

// copy non-javascript assets from src folder
const copy = function () {
  return gulp
    .src(['**/*.*'], {
      cwd: path.join(__dirname, 'src'),
      ignore: ['**/*.{ts,js,json}']
    })
    .pipe(gulp.dest(dist));
};

gulp.task('copy', gulp.series(copy));

function tsc(done) {
  spawnAsync(cmd('tsc'), ['-p', 'tsconfig.build.json'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  })
    .then(() => done())
    .catch(done);
}

gulp.task('clean', (done) => {
  if (fs.existsSync(dist)) {
    fs.emptyDir(dist, done);
  } else {
    done();
  }
});

gulp.task('build', gulp.series('copy:fa', tsc, copy));

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

gulp.task('watch', function (done) {
  const v = gulp.watch(
    '**/*',
    { cwd: __dirname + '/src/views' },
    gulp.series('compile:css')
  );
  const x = gulp.watch(
    'scripts/**/*',
    { cwd: __dirname + '/source' },
    gulp.series('compile:js')
  );
  const y = gulp.watch(
    'styles/**/*',
    { cwd: __dirname + '/source' },
    gulp.series('compile:css')
  );

  const z = gulp.watch(
    '**/*.ts',
    {
      ignored: ['**/public/**'],
      cwd: __dirname + '/src'
    },
    gulp.series(startServer)
  );

  [v, x, y, z].forEach((p) => {
    p.once('close', () => done());
  });
  gulp.parallel('compile:js', 'compile:css', startServer)(null);
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
