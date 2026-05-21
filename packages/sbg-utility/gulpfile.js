import crossSpawn, { spawnAsync } from 'cross-spawn';
import fs from 'fs-extra';
import * as glob from 'glob';
import gulp from 'gulp';
import path from 'node:path';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
import { fileURLToPath } from 'url';
import YAML from 'yaml';
import { build, compileDeclarations } from './rollup-preserve.js';
import { generateExports } from './src/utils/generate-exports.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function populateConfig() {
  const configYmlPath = path.join(__dirname, 'test', '_config.yml');
  const configJsonPath = path.join(__dirname, 'src', 'config', '_config.json');
  const distConfigPath = path.join(__dirname, 'dist', '_config.json');

  let configObj;

  if (fs.existsSync(configYmlPath)) {
    const ymlContent = fs.readFileSync(configYmlPath, 'utf8');
    configObj = YAML.parse(ymlContent);
  } else if (fs.existsSync(configJsonPath)) {
    console.warn('YAML config not found at', configYmlPath, '- using existing JSON config');
    configObj = JSON.parse(fs.readFileSync(configJsonPath, 'utf8'));
  } else {
    console.error('YAML config not found at', configYmlPath);
    return;
  }

  fs.ensureDirSync(path.dirname(configJsonPath));
  fs.writeFileSync(configJsonPath, JSON.stringify(configObj, null, 2));
  console.log('Created _config.json at', configJsonPath);
  // Also write a copy into dist so builder scripts that run from dist can read it
  fs.ensureDirSync(path.dirname(distConfigPath));
  fs.writeFileSync(distConfigPath, JSON.stringify(configObj, null, 2));
  console.log('Created _config.json at', distConfigPath);
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
    console.log('Copied', path.relative(__dirname, src), '->', path.relative(__dirname, dest));
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

// tsc --build tsconfig.browser.json
// tsc --build tsconfig.node.json
// tsc --build tsconfig.json
// rollup -c

async function tsc() {
  // populate config if not exists
  const configJsonPath = path.join(__dirname, 'src', 'config', '_config.json');
  if (!fs.existsSync(configJsonPath)) {
    await populateConfig();
  }
  await spawnAsync('yarn', ['exec', 'tsc', '--build', 'tsconfig.node.json'], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });
}

gulp.task('tsc', tsc);
gulp.task('rollup', build);

async function buildIndexDts() {
  const bundle = await rollup({
    input: 'src/index.ts',
    plugins: [dts()]
  });

  await bundle.write({
    file: 'dist/index.d.ts',
    format: 'es'
  });

  await bundle.write({
    file: 'dist/index.d.cts',
    format: 'es'
  });

  await bundle.write({
    file: 'dist/index.d.mts',
    format: 'es'
  });
}

gulp.task('dts', gulp.series(compileDeclarations, buildIndexDts));
async function buildBrowser() {
  // Ensure config is populated before building browser bundle
  const configJsonPath = path.join(__dirname, 'src', 'config', '_config.json');
  if (!fs.existsSync(configJsonPath)) {
    await populateConfig();
  }
  await spawnAsync('node', [path.join(__dirname, 'rollup-browser.js')], {
    cwd: __dirname,
    shell: true,
    stdio: 'inherit'
  });
  // Copy dist/browser/**/*.d.ts files to dist/browser/**/*.d.mts and dist/browser/**/*.d.cts
  const dtsFiles = await glob.glob('dist/browser/**/*.d.ts', { absolute: true });
  for (const dtsFile of dtsFiles) {
    const relativePath = path.relative(path.join(__dirname, 'dist'), dtsFile);
    const destMts = path.join(__dirname, 'dist', relativePath.replace(/\.d\.ts$/, '.d.mts'));
    const destCts = path.join(__dirname, 'dist', relativePath.replace(/\.d\.ts$/, '.d.cts'));
    fs.copySync(dtsFile, destMts, { overwrite: true });
    fs.copySync(dtsFile, destCts, { overwrite: true });
    process.stdout.write(
      `\rCopied\n  ${path.relative(__dirname, dtsFile)} -> ${path.relative(__dirname, destMts)}\n  ${path.relative(__dirname, dtsFile)} -> ${path.relative(__dirname, destCts)}  `
    );
  }
  console.log('\nBrowser build complete.');
}
gulp.task('build-browser', buildBrowser);

function generateExportsTask() {
  generateExports({
    pkgPath: path.join(process.cwd(), 'package.json'),
    exportValues: {
      '.': {
        require: './dist/index.cjs',
        import: './dist/index.mjs',
        types: './dist/index.d.mts'
      },
      './package.json': './package.json',
      './browser': {
        require: './dist/browser/index.cjs',
        import: './dist/browser/index.mjs',
        types: './dist/browser/index.d.ts'
      }
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
gulp.task('generate-exports', generateExportsTask);

async function clean() {
  await fs.rm(path.join(__dirname, 'dist'), { recursive: true, force: true });
  await fs.rm(path.join(__dirname, 'tmp'), { recursive: true, force: true });
}

gulp.task('clean', gulp.series(clean));

gulp.task('populate-config', populateConfig);

// index-builder task: runs all src/**/*.builder.{ts,cjs,mjs} files as in index-builder.mjs
gulp.task('index-builder', async function () {
  const files = glob.sync('src/**/*.builder.{ts,cjs,mjs}', { nodir: true });

  for (const file of files) {
    const ext = path.extname(file);
    const outputPath = path.resolve(__dirname, file.replace(ext, '.cjs'));

    const env = {
      ...process.env,
      NODE_ENV: 'development',
      ROLLUP_INPUT: file,
      ROLLUP_OUTPUT: outputPath
    };

    console.log(`Processing: ${file}`);

    try {
      if (ext === '.ts') {
        // Use run-ts for .ts files to ensure they are compiled before execution
        await new Promise((resolve, reject) => {
          const proc = crossSpawn('run-ts', [file], { stdio: 'inherit', shell: true, env });

          proc.on('close', (code) => {
            if (code !== 0) reject(new Error(`Rollup failed with code ${code}`));
            else resolve();
          });
        });
      } else {
        await new Promise((resolve, reject) => {
          const proc = crossSpawn(
            'node',
            ['--no-warnings', '--experimental-specifier-resolution=node', '-r', 'dotenv/config', file],
            { stdio: 'inherit', shell: true, env }
          );

          proc.on('close', (code) => {
            if (code !== 0) reject(new Error(`Process exited with code ${code}`));
            else resolve();
          });
        }).catch((error) => {
          console.error(`Error processing ${file}:`, error);
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  }
});

gulp.task('generate-exports', gulp.series(generateExportsTask));
gulp.task('build', gulp.series('populate-config', 'index-builder', 'tsc', 'copy', 'rollup', 'dts', 'generate-exports'));

gulp.task('default', gulp.series('build', 'build-browser'));
