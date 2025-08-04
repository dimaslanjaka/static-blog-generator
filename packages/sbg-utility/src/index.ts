// Pollyfill globalThis in Node.js
import './pollyfill/global-file';

// Importing necessary modules
import fs from 'fs-extra';
import path from 'upath';

import * as wildcards from './index-exports';
export * from './index-exports';
export { fs, path };
export default wildcards;

//
