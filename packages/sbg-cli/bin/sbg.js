#!/usr/bin/env node

'use strict';

// if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
//   require('../dist/src/index.cjs').cli();
// } else {
//   import('../dist/src/index.mjs').then((lib) => {
//     lib.cli();
//   });
// }

import('../dist/src/index.mjs').then((lib) => {
  lib.cli();
});
