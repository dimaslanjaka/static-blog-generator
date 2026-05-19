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

  // Prefer a dedicated declaration tsconfig if present
  const configPath =
    ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.dts.json') ||
    ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) throw new Error('tsconfig.json not found');

  const parsed = ts.getParsedCommandLineOfConfigFile(configPath, {}, ts.sys);
  if (!parsed) throw new Error('Failed to parse tsconfig');

  const compilerBase = {
    ...parsed.options,
    emitDeclarationOnly: true,
    declaration: true,
    declarationMap: false,
    noEmitOnError: false,
    rootDir: 'src',
    target: ts.ScriptTarget.ESNext,
    allowJs: true
  };

  const rootNames = glob.sync('src/**/*.{ts,js}', {
    ignore: ['**/*.spec.*', '**/*.test.*', '**/__mocks__/**', '**/*builder*'].concat(tsconfig.exclude)
  });

  // Helper to emit declarations for a given module kind and copy to module-specific extension
  function emitFor(moduleKind, subdir, outExt) {
    const out = path.resolve(outDir, subdir);
    const options = {
      ...compilerBase,
      outDir: out,
      module: moduleKind
    };

    // Declaration emit needs NodeNext so files that use import.meta remain valid.
    options.moduleResolution = ts.ModuleResolutionKind.NodeNext;

    const program = ts.createProgram(rootNames, options);
    const emitResult = program.emit();

    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    if (diagnostics.length) {
      for (const d of diagnostics) {
        const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
        const loc = d.file ? `${d.file.fileName}:${d.start}` : '';
        process.stdout.write(`\n[TS] ${path.relative(process.cwd(), loc)} ${msg}`);
      }
    } else {
      process.stdout.write(colors.green(`\n✔ All declarations emitted (${subdir}).`));
    }

    // Copy and rename emitted .d.ts -> .d.mts or .d.cts into final dist locations
    const emitted = glob.sync(path.join(out, '**/*.d.ts'));
    for (const f of emitted) {
      const rel = path.relative(out, f).replace(/\.d\.ts$/, '');
      const finalDest = path.resolve(outDir, rel + outExt);
      fs.mkdirSync(path.dirname(finalDest), { recursive: true });
      fs.copyFileSync(f, finalDest);
      process.stdout.write(
        `\r${colors.green('✔ Copied')} ${colors.gray(path.relative(process.cwd(), f))} ${colors.cyan('→')} ${colors.magenta(path.relative(process.cwd(), finalDest))} ${'\t'.repeat(7)}`
      );
    }
  }

  // Emit ESM declarations (.d.mts).
  emitFor(ts.ModuleKind.NodeNext, 'esm', '.d.mts');

  // Emit CJS declarations (.d.cts).
  emitFor(ts.ModuleKind.NodeNext, 'cjs', '.d.cts');

  console.log('\n' + colors.green('✔ Declaration emit complete (module-specific).'));
}

const isDirect = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirect) {
  // This block is executed when running this file directly via "node ..."
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
