import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'path';
import { normalizePathUnix } from 'sbg-utility';
import { fileURLToPath } from 'url';

// index.ts exports builder
// this only for development and excluded from build config

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create export
glob
  .glob('**/*.{ts,js,jsx,tsx,cjs,mjs}', {
    ignore: ['**/*.builder.*', '**/*.test.*', '**/*.spec.*', '**/*.runner.*'],
    cwd: __dirname,
    absolute: true
  })
  .then((files) => {
    const contents = files
      .filter((file) => fs.statSync(file).isFile())
      .map((file) => normalizePathUnix(file).replace(normalizePathUnix(__dirname), ''))
      .map((file) => {
        return `export * from '.${file.replace(/.(ts|js|tsx|jsx)$/, '')}';`;
      })
      .sort(
        (a, b) => a.localeCompare(b) //using String.prototype.localCompare()
      );
    // dump
    console.log(contents);
    // fix eslint
    contents.push('', '//', '');

    fs.writeFileSync(path.join(__dirname, 'index.ts'), contents.join('\n'));

    spawnSync('eslint', ['--fix', 'src/**/*.ts'], {
      cwd: process.cwd()
    });
  });
