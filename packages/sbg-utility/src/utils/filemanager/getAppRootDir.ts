import fs from 'fs-extra';
import path from 'upath';
import { fileURLToPath } from 'url';
import { trueCasePathSync } from './path-utility';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getAppRootDir() {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.join(currentDir, '..');
  }
  return path.toUnix(trueCasePathSync(currentDir));
}

export default getAppRootDir;
