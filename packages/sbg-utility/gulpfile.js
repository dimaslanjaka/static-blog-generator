import crossSpawn from 'cross-spawn';
import fs from 'fs-extra';
import * as glob from 'glob';
import gulp from 'gulp';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { buildAll, compileCJS, compileDeclarations, compileESM, getInputFiles } from './rollup-build.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function get_binary_path(commandName) {
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
}

// copy non-javascript assets from src folder
const copy = async function () {
  // Copy for one file build. see rollup _oneFile
  const files = await glob.glob(['./src/**/*.*'], {
    ignore: ['**/*.{ts,js,cjs,mjs}', '**/*.{ts,js,cjs,mjs}.txt'],
    absolute: true
  });

  for (let i = 0; i < files.length; i++) {
    const src = files[i];
    const dest = path.join(__dirname, 'dist', path.basename(src));
    fs.copySync(src, dest, { overwrite: true });
    console.log('Copied', src.replace(__dirname, ''), '->', dest.replace(__dirname, ''));
  }

  // Copy for partial build. See rollup _partial
  await new Promise((resolve) => {
    gulp
      .src(['./src/**/*.*'], { ignore: ['**/*.{ts,js,cjs,mjs}', '**/*.{ts,js,cjs,mjs}.txt'] })
      .pipe(gulp.dest('dist'))
      .once('end', resolve);
  });
};

gulp.task('copy', copy);

// tsc --build tsconfig.build.json
// tsc --build tsconfig.docs.json
// tsc --build tsconfig.json
// rollup -c

async function tsc() {
  await crossSpawn.spawnAsync(get_binary_path('tsc'), ['--build', 'tsconfig.docs.json'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });
  // await crossSpawn.spawnAsync(get_binary_path('yarn'), ['run', 'rollup'], {
  //   cwd: __dirname,
  //   shell: true,
  //   stdio: 'inherit'
  // });
}

gulp.task('tsc', tsc);
gulp.task('rollup', gulp.series(buildAll));
gulp.task('rollup-dts', gulp.series(compileDeclarations));
gulp.task(
  'rollup-esm',
  gulp.series(async function () {
    const inputFiles = getInputFiles();
    for (const inputFile of inputFiles) {
      const outputBase = path.join('dist', path.relative('src', inputFile)).replace(/\.[^.]+$/, '');
      await compileESM(inputFile, outputBase + '.mjs');
    }
  })
);
gulp.task(
  'rollup-cjs',
  gulp.series(async function () {
    const inputFiles = getInputFiles();
    for (const inputFile of inputFiles) {
      const outputBase = path.join('dist', path.relative('src', inputFile)).replace(/\.[^.]+$/, '');
      await compileCJS(inputFile, outputBase + '.cjs');
    }
  })
);
gulp.task('build', gulp.series('tsc', 'copy', 'rollup'));

async function clean() {
  await fs.rm(path.join(__dirname, 'dist'), { recursive: true, force: true });
}

gulp.task('clean', gulp.series(clean));

gulp.task('default', gulp.series('build'));
