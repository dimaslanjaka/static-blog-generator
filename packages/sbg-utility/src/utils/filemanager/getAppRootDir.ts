import fs from 'fs-extra';
import path from 'upath';
import { trueCasePathSync } from './case-path';

export function getAppRootDir() {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.join(currentDir, '..');
  }
  return path.toUnix(trueCasePathSync(currentDir));
}

export default getAppRootDir;
