#!/usr/bin/env node

'use strict';

// if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
//   require('../dist/index.cjs').cli();
// } else {
//   import('../dist/index.mjs').then((lib) => {
//     lib.cli();
//   });
// }

import('../dist/index.mjs').then((lib) => {
  lib.cli();
});
