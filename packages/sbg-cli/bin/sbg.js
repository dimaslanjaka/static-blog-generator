#!/usr/bin/env node

'use strict';

const isESM = typeof import.meta !== 'undefined';
// const isCJS = typeof require !== 'undefined' && typeof exports !== 'undefined';

console.log('sbg cli running on', isESM ? 'ESM' : 'CJS');

if (isESM) {
  import('../dist/cli.mjs');
} else {
  import('../dist/cli.cjs');
}
