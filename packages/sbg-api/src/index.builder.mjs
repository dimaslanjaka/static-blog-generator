import { ESLint } from 'eslint';
import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { normalizePathUnix } from 'sbg-utility';
import { fileURLToPath } from 'url';
import { parse } from '@babel/parser';

// index.ts exports builder
// this only for development and excluded from build config

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * A file is considered "effectively empty" if it has:
 * - no executable statements
 * - only comments / whitespace
 */
function isEffectivelyEmpty(code) {
  try {
    const ast = parse(code, {
      sourceType: 'unambiguous',
      plugins: ['typescript', 'jsx']
    });

    const body = ast.program.body;

    // No statements at all → only comments/whitespace
    if (!body || body.length === 0) return true;

    // If there is any node, it is NOT empty
    return false;
  } catch {
    // If parsing fails, assume NOT empty (safer default)
    return false;
  }
}

// create export
glob('**/*.{ts,js,jsx,tsx,cjs,mjs}', {
  ignore: ['**/*.builder.*', '**/*.test.*', '**/*.spec*.*', '**/*.runner.*', '**/_*test'],
  cwd: __dirname,
  absolute: true
}).then(async (files) => {
  const map = files
    .map((f) => normalizePathUnix(f))
    .filter((file) => {
      const isFile = fs.statSync(file).isFile();
      const currentIndex = normalizePathUnix(__dirname, 'index.ts');
      const currentIndexExports = normalizePathUnix(__dirname, 'index-exports.ts');
      return isFile && file !== currentIndex && file !== currentIndexExports;
    })
    .map((file) => normalizePathUnix(file).replace(normalizePathUnix(__dirname), ''))
    .map((file) => {
      const fileId =
        '_' +
        normalizePathUnix(file)
          .replace(normalizePathUnix(__dirname), '')
          .replace(/.(ts|js|tsx|jsx|cjs)$/, '');

      const importName = fileId
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const fullPath = path.join(__dirname, file);
      const content = fs.readFileSync(fullPath, 'utf-8');

      const isEmptyContent = isEffectivelyEmpty(content);

      if (isEmptyContent) {
        console.warn(`Warning: Skipping empty file ${file}`);
        return null;
      }

      const cleanPath = file.replace(/.(ts|js|tsx|jsx|cjs)$/, '');

      return {
        file,
        name: importName,
        import: `import * as ${importName} from '.${cleanPath}';`,
        export: `export * from '.${cleanPath}';`
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(path.join(__dirname, 'index-exports.ts'), map.map((o) => o.export).join('\n'));

  fs.writeFileSync(
    path.join(__dirname, 'index.ts'),
    [`export * from './index-exports'`, `import * as lib from './index-exports'`, 'export default lib'].join('\n')
  );

  const lint = new ESLint({ fix: true });

  const results = await lint.lintFiles(['src/**/*.ts']);

  await ESLint.outputFixes(results);

  const formatter = await lint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  console.log(resultText);
});
