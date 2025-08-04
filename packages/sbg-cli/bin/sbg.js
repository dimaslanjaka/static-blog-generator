#!/usr/bin/env node

'use strict';

import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
const isESM = pkg.type === 'module';
// const isESM = typeof import.meta !== 'undefined';
// const isCJS = typeof require !== 'undefined' && typeof exports !== 'undefined';

console.log('sbg cli running on', isESM ? 'ESM' : 'CJS');

if (isESM) {
  import('../dist/index.mjs').then((lib) => lib.cli());
} else {
  import('../dist/index.cjs').then((lib) => lib.cli());
}
