// Pollyfill globalThis in Node.js
import './pollyfill/global-file';

// Importing necessary modules
import fs from 'fs-extra';
import path from 'upath';

export { fs, path };
