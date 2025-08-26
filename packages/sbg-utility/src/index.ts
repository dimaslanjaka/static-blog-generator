// Pollyfill globalThis in Node.js
import './pollyfill/global-file';

// Import/Export necessary modules

import * as wildcards from './index-exports';
export * from './external';
export * from './index-exports';
export default wildcards;

//
