import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

// index.ts exports builder
// this only for development and excluded from build config

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexFile = path.join(__dirname, 'index.ts');

const indexContent = `export * from './index-exports.js';
import * as lib from './index-exports.js';
export default lib;
`;

const indexExportsFile = path.join(__dirname, 'index-exports.ts');

/**
 * Get output export extension for generated exports.
 *
 * @param {string} file
 * @returns {string}
 */
function getExportExtension(file) {
  if (file.endsWith('.ts.js')) {
    return '.js';
  }

  /** @type {string} */
  const sourceExtension = path.extname(file);

  if (sourceExtension === '.ts' || sourceExtension === '.tsx' || sourceExtension === '.jsx') {
    return '.js';
  }

  return sourceExtension || '.js';
}

// create export
glob
  .glob('**/*.{ts,js,jsx,tsx,cjs,mjs}', {
    ignore: ['**/*.runner.*', '**/*.builder.*'],
    cwd: __dirname,
    posix: true
  })
  .then((files) => {
    const contents = files
      .filter((file) => !file.includes('./builder') && file !== 'index.ts' && file !== 'index-exports.ts')
      .map((file) => {
        const base = file.replace(/\.(ts|js|tsx|jsx|cjs|mjs)$/, '');

        return `export * from './${base}${getExportExtension(file)}';`;
      })
      .sort(
        (a, b) => a.localeCompare(b) // using String.prototype.localeCompare()
      );

    // fix eslint
    contents.push('', '//', '');

    fs.writeFileSync(indexExportsFile, contents.join('\n'));
    fs.writeFileSync(indexFile, indexContent);

    spawnSync('eslint', ['--fix', '**/*.js'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
  });
