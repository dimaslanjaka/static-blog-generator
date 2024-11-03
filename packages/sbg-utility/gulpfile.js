import crossSpawn from 'cross-spawn'; // CommonJS module
import fs from 'fs-extra'; // CommonJS module
import * as glob from 'glob';
import gulp from 'gulp'; // ES module
import path from 'path'; // CommonJS module
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

// copy non-javascript assets from src folder
const copy = async function () {
  // path.join(__dirname, 'dist')
  const files = await glob.glob(['./src/**/*.*'], { ignore: ['**/*.{ts,js,cjs,mjs}'], absolute: true });

  for (let i = 0; i < files.length; i++) {
    const src = files[i];
    const dest = path.join(__dirname, 'dist', path.basename(src));
    fs.copySync(src, dest, { overwrite: true });
    console.log('Copied', src.replace(__dirname, ''), '->', dest.replace(__dirname, ''));
  }
};

gulp.task('copy', copy);

async function tsc() {
  await crossSpawn.spawnAsync(cmd('tsc'), ['--build', 'tsconfig.docs.json'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });
  await crossSpawn.spawnAsync(cmd('rollup'), ['-c'], {
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
