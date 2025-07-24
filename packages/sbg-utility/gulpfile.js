import crossSpawn from 'cross-spawn';
import fs from 'fs-extra';
import * as glob from 'glob';
import gulp from 'gulp';
import path from 'node:path';
import { fileURLToPath } from 'url';
import YAML from 'yaml';
import { compileDeclarations } from './rollup-preserve.js';
import { generateExports } from './src/utils/generate-exports.js';

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
}

gulp.task('tsc', tsc);
gulp.task(
  'rollup',
  gulp.series(async function () {
    await crossSpawn.spawnAsync('node', [path.join(__dirname, 'rollup-preserve.js')], {
      cwd: __dirname,
      shell: true,
      stdio: 'inherit'
    });
  })
);
gulp.task('rollup-dts', gulp.series(compileDeclarations));

function generateExportsTask() {
  generateExports({
    pkgPath: path.join(process.cwd(), 'package.json'),
    useDefaultFolders: true,
    useDefaultExport: true,
    exportsValues: {
      '.': {
        require: {
          default: './dist/index.cjs',
          types: './dist/index.d.cts'
        },
        import: {
          default: './dist/index.mjs',
          types: './dist/index.d.mts'
        }
      },
      './package.json': './package.json'
    },
    folders: [
      { dir: `${process.cwd()}/dist/utils`, prefix: './dist/utils/' },
      { dir: `${process.cwd()}/dist/sitemap-crawler`, prefix: './dist/sitemap-crawler/' },
      { dir: `${process.cwd()}/dist/gulp-utils`, prefix: './dist/gulp-utils/' }
    ].map((folder) => ({
      dir: path.resolve(folder.dir),
      prefix: folder.prefix
    }))
  });
  return Promise.resolve();
}
gulp.task('generate-exports', gulp.series(generateExportsTask));
gulp.task('build', gulp.series('tsc', 'copy', 'rollup', 'rollup-dts', 'generate-exports'));

async function clean() {
  await fs.rm(path.join(__dirname, 'dist'), { recursive: true, force: true });
}

gulp.task('clean', gulp.series(clean));

gulp.task('default', gulp.series('build'));

gulp.task('populate-config', async function () {
  const configYmlPath = path.join(__dirname, 'test', '_config.yml');
  const configJsonPath = path.join(__dirname, 'src', 'config', '_config.json');

  if (!fs.existsSync(configYmlPath)) {
    console.error('YAML config not found at', configYmlPath);
    return;
  }

  const ymlContent = fs.readFileSync(configYmlPath, 'utf8');
  const configObj = YAML.parse(ymlContent);
  fs.ensureDirSync(path.dirname(configJsonPath));
  fs.writeFileSync(configJsonPath, JSON.stringify(configObj, null, 2));
  console.log('Created _config.json at', configJsonPath);
});
