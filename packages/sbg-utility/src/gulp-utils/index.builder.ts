import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'path';

// src/functions/index.ts exports builder
// this only for development and excluded from build config

// create export
glob.glob('**/*.{ts,js,jsx,tsx}', { ignore: ['**/*.builder.*'], cwd: __dirname, posix: true }).then((files) => {
  const contents = files
    .filter((file) => !file.includes('.builder') && path.extname(file) === '.ts')
    .map((file) => {
      return `export * from './${file.replace(/.(ts|js|tsx|jsx)$/, '')}';`;
    });
  // dump
  console.log(contents);
  // fix eslint
  contents.push('', '//', '');

  fs.writeFileSync(path.join(__dirname, 'index.ts'), contents.join('\n'));

  spawnSync('eslint', ['--fix', 'src/**/*.ts'], { cwd: path.join(__dirname, '../..') });
});
