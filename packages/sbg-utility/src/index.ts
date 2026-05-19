// Pollyfill globalThis in Node.js
import './pollyfill/global-file.js';

// Import/Export necessary modules

import * as wildcards from './index-exports.js';
export * from './external.js';
export * from './index-exports.js';
export default wildcards;

//
