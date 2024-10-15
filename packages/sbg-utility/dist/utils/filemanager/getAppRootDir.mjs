import fs__default from 'fs-extra';
import path__default from 'upath';
import { trueCasePathSync } from './case-path.mjs';

function getAppRootDir() {
    let currentDir = __dirname;
    while (!fs__default.existsSync(path__default.join(currentDir, 'package.json'))) {
        currentDir = path__default.join(currentDir, '..');
    }
    return path__default.toUnix(trueCasePathSync(currentDir));
}

export { getAppRootDir as default, getAppRootDir };
