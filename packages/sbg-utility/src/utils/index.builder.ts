import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

// src/functions/index.ts exports builder
// this only for development and excluded from build config

// create export
const contents = fs
  .readdirSync(__dirname)
  .filter((file) => !file.includes('.builder') && path.extname(file) === '.ts')
  .map((file) => {
    return `export * from './${file.replace(/.ts$/, '')}';`;
  });
// dump
console.log(contents);
// fix eslint
contents.push('', '//', '');

fs.writeFileSync(path.join(__dirname, 'index.ts'), contents.join('\n'));

spawnSync('eslint', ['--fix', 'src/**/*.ts'], { cwd: path.join(__dirname, '../..') });
