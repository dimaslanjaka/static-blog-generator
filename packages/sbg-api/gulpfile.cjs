// const fs = require('fs-extra');
const { spawnAsync } = require('cross-spawn');
const gulp = require('gulp');
const path = require('upath');
const fs = require('fs-extra');
const through2 = require('through2');

const cmd = (commandName) => {
  const cmdPath = [
    __dirname,
    process.cwd(),
    (process.mainModule || process.main).paths[0].split('node_modules')[0].slice(0, -1)
  ]
    .map((cwd) => {
      const nm = path.join(cwd, 'node_modules/.bin');
      const cmdPath = path.join(nm, commandName);
      return cmdPath;
    })
    .filter(fs.existsSync)[0];

  return process.platform === 'win32' ? cmdPath.replace(/\//g, '\\\\') + '.cmd' : cmdPath;
};

// copy non-javascript assets from src folder
const copyAssets = function () {
  return gulp
    .src(['**/*.*'], { cwd: path.join(__dirname, 'src'), ignore: ['**/*.{ts,js,json,cjs,mjs}'] })
    .pipe(gulp.dest(path.join(__dirname, 'dist/src')));
};

gulp.task('copy', gulp.series(copyAssets));

function copyDeclarations() {
  return gulp
    .src('dist/**/*.d.ts') // Adjust the path as needed
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.isBuffer()) {
          const newFileName = file.path.replace(/\.d\.ts$/, '.d.mts');

          // Create a new file stream with the same content but different extension
          fs.writeFile(newFileName, file.contents, (err) => {
            if (err) {
              cb(new Error(`Failed to write file ${newFileName}: ${err.message}`));
            } else {
              // console.log(`Copied: ${file.path} to ${newFileName}`);
              cb(null, file); // Pass the original file to the next stream
            }
          });
        } else {
          cb(null, file); // Pass the original file to the next stream
        }
      })
    );
}

async function buildDist() {
  spawnAsync(cmd('tsc'), ['--build', 'tsconfig.docs.json'], { cwd: __dirname, shell: true, stdio: 'inherit' });
  await spawnAsync(cmd('rollup'), ['-c'], { cwd: __dirname, shell: true, stdio: 'inherit' });
}

gulp.task('build', gulp.series(buildDist, copyAssets, copyDeclarations));
