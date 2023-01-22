import fs from 'fs-extra';
import { trueCasePathSync } from 'true-case-path';
import path from 'upath';

export function getAppRootDir() {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.join(currentDir, '..');
  }
  return path.toUnix(trueCasePathSync(currentDir));
}

export default getAppRootDir;
