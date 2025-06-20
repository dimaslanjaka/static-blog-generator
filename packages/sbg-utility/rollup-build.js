import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import colors from 'ansi-colors';
import fs from 'fs/promises';
import * as glob from 'glob';
import path from 'path';
import { rollup } from 'rollup';
import stripAnsi from 'strip-ansi';
import ts from 'typescript';
import { fileURLToPath, pathToFileURL } from 'url';
import { external, tsconfig } from './rollup.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logPath = path.join(__dirname, 'tmp/build.log');
const isDirect = import.meta.url === pathToFileURL(process.argv[1]).href;

// Reset log file at the start
await fs.mkdir(path.dirname(logPath), { recursive: true });
await fs.writeFile(logPath, '');
if (isDirect) {
  try {
    await fs.access(path.join(__dirname, 'dist'));
    await fs.rm(path.join(__dirname, 'dist'), { recursive: true, force: true });
  } catch (_) {}
}

const logResult = async (...args) => {
  console.log(...args);
  const plain = args.map((r) => stripAnsi(String(r))).join('\n');
  await fs.appendFile(logPath, plain + '\n');
};

const getPlugins = () => [
  resolve({ preferBuiltins: true }),
  json(),
  commonjs(),
  typescript({
    tsconfig: false,
    compilerOptions: { ...tsconfig.compilerOptions },
    include: ['./src/**/*'],
    exclude: tsconfig.exclude
  })
];

export async function compileESM(inputFile, outputFile) {
  try {
    logResult(`${colors.cyan('📦 [ESM]')} ${colors.gray(inputFile)} ${colors.cyan('→')} ${colors.magenta(outputFile)}`);

    const bundle = await rollup({
      input: inputFile,
      plugins: getPlugins(),
      external
    });

    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    await bundle.write({
      file: outputFile,
      format: 'esm',
      sourcemap: false
    });

    await bundle.close();

    logResult(`${colors.green('✔ [ESM]')} ${colors.magenta(outputFile)}`);
  } catch (err) {
    logResult(`${colors.red('❌ [ESM] Failed')} ${colors.gray(inputFile)}`);
    logResult(colors.red(err.message));
  }
}

export async function compileCJS(inputFile, outputFile) {
  try {
    logResult(`${colors.cyan('📦 [CJS]')} ${colors.gray(inputFile)} ${colors.cyan('→')} ${colors.magenta(outputFile)}`);

    const bundle = await rollup({
      input: inputFile,
      plugins: getPlugins(),
      external
    });

    await fs.mkdir(path.dirname(outputFile), { recursive: true });

    await bundle.write({
      file: outputFile,
      format: 'cjs',
      sourcemap: false
    });

    await bundle.close();

    logResult(`${colors.green('✔ [CJS]')} ${colors.magenta(outputFile)}`);
  } catch (err) {
    logResult(`${colors.red('❌ [CJS] Failed')} ${colors.gray(inputFile)}`);
    logResult(colors.red(err.message));
  }
}

/**
 * Generate .d.ts declaration for index-exports.ts in both .d.cts and .d.mts
 */
export async function compileDeclarations() {
  const outDir = path.resolve('dist');

  await logResult(colors.cyan(`📄 Emitting declarations for all modules...`));

  const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) throw new Error('tsconfig.json not found');

  const parsed = ts.getParsedCommandLineOfConfigFile(configPath, {}, ts.sys);
  if (!parsed) throw new Error('Failed to parse tsconfig');

  const compilerOptions = {
    ...parsed.options,
    outDir,
    emitDeclarationOnly: true,
    declaration: true,
    declarationMap: false,
    noEmitOnError: false,
    rootDir: 'src',
    target: ts.ScriptTarget.ESNext
  };

  const rootNames = glob.sync('src/**/*.{ts,js}', {
    ignore: ['**/*.spec.*', '**/*.test.*', '**/__mocks__/**'].concat(tsconfig.exclude)
  });

  const program = ts.createProgram(rootNames, compilerOptions);
  const emitResult = program.emit();

  const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  if (diagnostics.length) {
    for (const d of diagnostics) {
      const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
      const loc = d.file ? `${d.file.fileName}:${d.start}` : '';
      await logResult(colors.yellow(`[TS] ${loc} ${msg}`));
    }
  } else {
    await logResult(colors.green('✔ All declarations emitted.'));
  }

  // 🔁 Rename d.ts → d.mts or d.cts based on original extension
  const dtsFiles = glob.sync('dist/**/*.d.ts');

  for (const file of dtsFiles) {
    // Get the relative path to the base filename (e.g., dist/foo/bar.d.ts -> foo/bar)
    const relative = path.relative('dist', file).replace(/\.d\.ts$/, '');

    // Try to find the original file with one of the known extensions
    const sourceExts = ['.ts', '.js', '.mjs', '.cjs'];
    let originalFile = null;
    for (const ext of sourceExts) {
      const candidate = path.resolve('src', relative + ext);
      try {
        await fs.access(candidate);
        originalFile = candidate;
        break;
      } catch {}
    }

    if (!originalFile) {
      await logResult(colors.red(`⚠️ Cannot find original source for ${file}`));
      continue;
    }

    let newExt = '';
    if (originalFile.endsWith('.ts') || originalFile.endsWith('.mjs')) {
      newExt = '.d.mts';
    } else if (originalFile.endsWith('.cjs') || originalFile.endsWith('.js')) {
      newExt = '.d.cts';
    }

    if (newExt) {
      const newFile = file.replace(/\.d\.ts$/, newExt);
      await fs.rename(file, newFile);
      await logResult(colors.green(`✔ Renamed ${file} → ${newFile}`));
    }
  }
}

export async function compileBoth(inputFile, outputBase) {
  await compileESM(inputFile, outputBase + '.mjs');
  await compileCJS(inputFile, outputBase + '.cjs');
}

export async function buildAll() {
  const inputFiles = glob.globSync('src/**/*.{ts,js,cjs,mjs}', {
    posix: true,
    ignore: tsconfig.exclude.concat(
      '**/*.runner.*',
      '**/*.explicit.*',
      '**/*.test.*',
      '**/*.builder.*',
      '**/*.spec.*',
      '*browser*'
    )
  });

  logResult(colors.yellow(`${inputFiles.length} input files found:`) + '\n' + inputFiles.join('\n') + '\n');

  for (const inputFile of inputFiles) {
    const outputBase = path.join('dist', path.relative('src', inputFile)).replace(/\.[^.]+$/, '');
    await compileBoth(inputFile, outputBase);
  }

  // Also explicitly compile chain.ts if needed
  await compileBoth('src/utils/chain.ts', 'dist/utils/chain');

  // Emit all declarations after compiling
  await compileDeclarations();
}

// Entry point
if (isDirect) {
  // await buildAll().catch((err) => {
  //   console.error(colors.red('Build failed:\n'), err);
  //   process.exit(1);
  // });
  // Uncomment for single-file debug
  // await compileBoth('src/utils/chain.ts', 'dist/utils/chain').catch((err) => {
  //   console.error(colors.red('Build failed:\n'), err);
  //   process.exit(1);
  // });
  // emitAllDeclarations().catch((err) => {
  //   console.error(colors.red('Build failed:\n'), err);
  //   process.exit(1);
  // });
}
