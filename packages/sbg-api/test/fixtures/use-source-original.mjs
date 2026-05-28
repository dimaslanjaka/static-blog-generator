#!/usr/bin/env node

/**
 * Copies source-original/ → source/ with overwrite.
 * Use this to reset the test source directory to its pristine state.
 */

import fs from 'fs-extra';
import path from 'upath';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const originalDir = path.resolve(__dirname, 'source-original');
const targetDir = path.resolve(__dirname, 'source');

if (!fs.existsSync(originalDir)) {
  console.error('ERROR: source-original/ does not exist at', originalDir);
  process.exit(1);
}

if (fs.existsSync(targetDir)) {
  console.log('Removing existing source/...');
  fs.rmSync(targetDir, { recursive: true, force: true });
}

console.log('Copying source-original/ → source/...');
fs.emptyDirSync(targetDir);
fs.cpSync(originalDir, targetDir, { recursive: true });
console.log('Done.');
