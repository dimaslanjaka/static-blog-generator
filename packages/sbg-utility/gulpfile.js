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
