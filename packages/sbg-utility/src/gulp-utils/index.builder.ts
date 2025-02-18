import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import { Logger } from '../utils';

// index.ts exports builder
// this only for development and excluded from build config

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create export
glob.glob('**/*.{ts,js,jsx,tsx}', { ignore: ['**/*.builder.*'], cwd: __dirname, posix: true }).then((files) => {
  const contents = files
    .filter((file) => !file.includes('.builder'))
    .map((file) => {
      return `export * from './${file.replace(/.(ts|js|tsx|jsx)$/, '')}';`;
    })
    .sort(
      (a, b) => a.localeCompare(b) //using String.prototype.localCompare()
    );
  // dump
  Logger.log(contents);
  // fix eslint
  contents.push('', '//', '');

  fs.writeFileSync(path.join(__dirname, 'index.ts'), contents.join('\n'));

  spawnSync('eslint', ['--fix', 'src/**/*.ts'], { cwd: path.join(__dirname, '../..') });
});
