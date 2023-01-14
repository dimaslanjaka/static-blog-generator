const browserify = require('browserify');
const fs = require('fs-extra');
const path = require('upath');
const glob = require('glob');
const gulp = require('gulp');
const Bluebird = require('bluebird');
const utility = require('sbg-utility');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const spawn = require('child_process').spawn;
const kill = require('tree-kill');

const createWriteStream = (p) => {
  if (!fs.existsSync(path.dirname(p)))
    fs.mkdirSync(path.dirname(p), { recursive: true });
  return fs.createWriteStream(p);
};

const src = path.join(__dirname, './source/scripts');
const dist = path.join(__dirname, './src/public/js');
const scan = glob.sync('**/*.js', { cwd: src }) || [];
const entries = scan.map((str) => {
  return {
    input: path.join(src, str),
    output: path.join(dist, str)
  };
});

const bundle = (done) => {
  const bundler = (entry) =>
    new Bluebird((resolve) => {
      browserify(entry.input)
        .transform('babelify', {
          presets: ['@babel/preset-env']
        })
        .bundle()
        .pipe(createWriteStream(entry.output))
        .once('finish', () => resolve());
    });

  const callbacks = [];

  // push bundler
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    callbacks.push({ callback: () => bundler(entry) });
  }
  // push finish gulp task
  callbacks.push({ callback: done });

  return utility.chain.chain(callbacks);
};

gulp.task('compile:js', gulp.series(bundle));
gulp.task('watch', function () {
  gulp.watch(
    'scripts/**/*',
    { cwd: __dirname + '/source' },
    gulp.series('compile:js')
  );
  gulp.watch('styles/**/*', { cwd: __dirname + '/source' }, async function () {
    await spawnAsync('npm', ['run', 'tw'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    await spawnAsync('npm', ['run', 'purge'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
  });

  const pids = [];
  /** @type {import('child_process').ChildProcess[]} */
  const childs = [];
  const startServer = function (done) {
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

    const child = spawn('npm', ['run', 'dev:server'], {
      cwd: __dirname,
      shell: true,
      detached: true
    });
    child.once('exit', (code, signal) => {
      console.log('subprocess', child.pid, 'exit', { code, signal });
    });
    child.once('spawn', () => {
      pids.push(child.pid);
      childs.push(child);
      // typeof done === 'function' && done();
    });
    // child.once('message', () => pids.push(child.pid));
    child.once('close', () => typeof done === 'function' && done());
  };
  gulp.watch(
    '**/*.ts',
    {
      ignored: ['**/public/**'],
      cwd: __dirname + '/src'
    },
    startServer
  );
  gulp.series(startServer)(null);
});
