import crossSpawn from 'cross-spawn'; // CommonJS module
import fs from 'fs-extra'; // CommonJS module
import gulp from 'gulp'; // ES module
import through2 from 'through2';
import path from 'upath'; // CommonJS module
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** resolve cmd binary */
const cmd = (commandName) => {
  const cmdPath = [
    __dirname,
    process.cwd(),
    (process.mainModule || process.main).paths[0].split('node_modules')[0].slice(0, -1)
  ]
    .map((cwd) => {
      const nm = path.join(cwd, 'node_modules/.bin');
      return path.join(nm, commandName);
    })
    .filter(fs.existsSync)[0];

  if (!cmdPath) {
    console.error(`Command '${commandName}' not found in node_modules/.bin`);
    return commandName; // Return the original command name
  }

  return process.platform === 'win32' ? `${cmdPath}.cmd` : cmdPath;
};

function copyAssets() {
  return gulp.src('./src/**/*.{json,yml,xml,xsl}', { cwd: __dirname }).pipe(gulp.dest('./dist'));
}

// copy non-javascript assets from src folder
const copy = function () {
  return gulp
    .src(['**/*.*'], { cwd: path.join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] })
    .pipe(gulp.dest(path.join(__dirname, 'dist')));
};

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

gulp.task('copy', gulp.series(copy, copyAssets, copyDeclarations));

async function tsc() {
  await crossSpawn.spawnAsync(cmd('rollup'), ['-c'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });
  await crossSpawn.spawnAsync(cmd('tsc'), ['--build', 'tsconfig.docs.json'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });
}

gulp.task('build', gulp.series(tsc, 'copy'));

async function clean() {
  await fs.rm(path.join(__dirname, 'dist'), { recursive: true, force: true });
}

gulp.task('clean', gulp.series(clean));

gulp.task('default', gulp.series('build'));
