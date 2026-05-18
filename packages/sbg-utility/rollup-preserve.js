import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import colors from 'ansi-colors';
import fs from 'fs';
import * as glob from 'glob';
import { rollup } from 'rollup';
import ts from 'typescript';
import path from 'upath';
import { fileURLToPath, pathToFileURL } from 'url';
import { chunkFileNamesWithExt, entryFileNamesWithExt, externalPackages, tsconfig } from './rollup.utils.js';

fs.mkdirSync('tmp/dist', { recursive: true });
fs.writeFileSync('tmp/rollup.log', ''); // Clear previous log

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = 'tmp/dist/index.js';
const plugins = [
  nodeResolve({
    preferBuiltins: true,
    extensions: ['.mjs', '.js', '.json', '.node', '.cjs', '.jsx', '.ts', '.tsx']
  }),
  commonjs(),
  json(),
  babel({
    babelHelpers: 'bundled',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    exclude: 'node_modules/**',
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '12'
          },
          modules: false
        }
      ]
    ]
  })
];
const configs = [
  // ESM build
  {
    input,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: entryFileNamesWithExt('mjs'),
      chunkFileNames: chunkFileNamesWithExt('mjs'),
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist'
    },
    plugins,
    external: externalPackages
  },
  // CJS build
  {
    input,
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: entryFileNamesWithExt('cjs'),
      chunkFileNames: chunkFileNamesWithExt('cjs'),
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist'
    },
    plugins,
    external: externalPackages
  }
];

async function build() {
  for (const config of configs) {
    const bundle = await rollup(config);
    const outputs = Array.isArray(config.output) ? config.output : [config.output];
    for (const output of outputs) {
      await bundle.write(output);
    }
    await bundle.close();
  }
  console.log('Build complete.');
}

/**
 * Generate .d.ts declaration for index-exports.ts in both .d.cts and .d.mts
 */
export async function compileDeclarations() {
  const outDir = path.resolve('dist');

  console.log(colors.cyan(`📄 Emitting declarations for all modules...`));

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
      console.log(colors.yellow(`[TS] ${loc} ${msg}`));
    }
  } else {
    console.log(colors.green('✔ All declarations emitted.'));
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
        fs.accessSync(candidate);
        originalFile = candidate;
        break;
      } catch {}
    }

    if (!originalFile) {
      console.log(colors.red(`⚠️ Cannot find original source for ${file}`));
      continue;
    }

    const mts = file.replace(/\.d\.ts$/, '.d.mts');
    fs.copyFileSync(file, mts);
    console.log(`${colors.green('✔ Copied')} ${colors.gray(file)} ${colors.cyan('→')} ${colors.magenta(mts)}`);

    const cts = file.replace(/\.d\.ts$/, '.d.cts');
    fs.copyFileSync(file, cts);
    console.log(`${colors.green('✔ Copied')} ${colors.gray(file)} ${colors.cyan('→')} ${colors.magenta(cts)}`);

    // delete the original .d.ts file
    // fs.rmSync(file, { force: true });
    // console.log(`${colors.green('✔ Removed')} ${colors.gray(file)}`);
  }
}

const isDirect = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirect) {
  // This block is executed when running this file directly via "node ..."
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
