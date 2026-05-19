const { spawnAsync } = require('cross-spawn');
const gulp = require('gulp');
const path = require('upath');
const fs = require('fs-extra');
const through2 = require('through2');

function cmd(commandName) {
  const baseDir = process.cwd();
  const binBase = path.join(baseDir, 'node_modules', '.bin', commandName);

  const isWin = process.platform === 'win32';

  const candidates = isWin ? [`${binBase}.cmd`, `${binBase}.bat`, binBase] : [binBase];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return commandName;
}

// copy non-javascript assets from src folder
const copyAssets = function () {
  return gulp
    .src(['**/*.*'], { cwd: path.join(__dirname, 'src'), ignore: ['**/*.{ts,js,json,cjs,mjs}'] })
    .pipe(gulp.dest(path.join(__dirname, 'dist/src')));
};

gulp.task('copy', gulp.series(copyAssets));

/**
 * Copies TypeScript declaration files from `.d.ts` to `.d.mts` and `.d.cts` extensions.
 *
 * @returns {NodeJS.ReadWriteStream} A Gulp stream that processes the declaration files.
 */
function copyDeclarations() {
  return gulp
    .src('dist/**/*.d.ts') // Adjust the path as needed
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.isBuffer()) {
          const mtsFileName = file.path.replace(/\.d\.ts$/, '.d.mts');
          const ctsFileName = file.path.replace(/\.d\.ts$/, '.d.cts');

          try {
            // Write .d.mts and .d.cts files synchronously
            fs.writeFileSync(mtsFileName, file.contents);
            fs.writeFileSync(ctsFileName, file.contents);
            cb(null, file); // Pass the original file to the next stream
          } catch (err) {
            cb(new Error(`Failed to write files: ${err.message}`));
          }
        } else {
          cb(null, file); // Pass the original file to the next stream
        }
      })
    );
}

async function buildDist() {
  await spawnAsync(cmd('tsc'), ['--build', 'tsconfig.build.json'], { cwd: __dirname, shell: true, stdio: 'inherit' });
  await spawnAsync(cmd('tsc'), ['--build', 'tsconfig.docs.json'], { cwd: __dirname, shell: true, stdio: 'inherit' });
  await spawnAsync(cmd('rollup'), ['-c'], { cwd: __dirname, shell: true, stdio: 'inherit' });
}
gulp.task('build-dist', buildDist);
gulp.task('copy-assets', copyAssets);
gulp.task('copy-declarations', copyDeclarations);
gulp.task('build', gulp.series(buildDist, copyAssets, copyDeclarations));

gulp.task('pack', async function () {
  await spawnAsync(cmd('yarn'), ['run', 'pack'], { cwd: __dirname, shell: true, stdio: 'inherit' });
});

gulp.task('build-pack', gulp.series('build', 'pack'));

gulp.task('watch', function () {
  gulp.watch('./src/**/*.ts', { cwd: __dirname, ignored: ['**/index*'] }, gulp.series('build', 'pack'));
});
