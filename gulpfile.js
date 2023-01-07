const spawn = require('cross-spawn');
const { existsSync, mkdirSync, appendFileSync } = require('fs');
const { copyFile } = require('fs-extra');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const gulp = require('gulp');
const { join } = require('upath');

// copy non-javascript assets from src folder
const copy = function (done) {
  gulp
    .src(['**/*.*'], { cwd: join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] })
    .pipe(gulp.dest(join(__dirname, 'dist')))
    .once('end', async function () {
      // copy src/_config.json to dist (prevent git changing values of dist)
      await copyFile(join(__dirname, 'src/_config.json'), join(__dirname, 'dist/_config.json'));
      await copyFile(join(__dirname, 'src/_config.json'), join(__dirname, 'dist/_config.auto-generated.json'));
      done();
    });
};

function tsc(done) {
  const doCompile = () => {
    spawnAsync('npm', ['run', 'build'], { cwd: __dirname, stdio: 'inherit' }).then(() => done());
  };
  if (process.env.GITHUB_WORKFLOWS) {
    console.log('running in github workflows');
  }
  doCompile();
}

gulp.task('copy', copy);
gulp.task('tsc', tsc);

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

gulp.task('default', gulp.series(['tsc', 'copy']));
