import fs from 'fs';
import jsonc from 'jsonc-parser';
import path from 'path';
import { array_unique } from 'sbg-utility';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {typeof import('./tsconfig.json')}
 */
const tsconfig = jsonc.parse(fs.readFileSync(path.join(__dirname, 'tsconfig.json'), 'utf-8'));
delete tsconfig.compilerOptions.outDir;

/**
 * @type {typeof import('./package.json')}
 */
const pkg = jsonc.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
export const external = array_unique(
  Object.keys(pkg.dependencies)
    .concat(Object.keys(pkg.devDependencies))
    .concat(
      'hexo',
      'warehouse',
      'hexo-util',
      'canvas',
      'jsdom',
      'mime-db',
      'sbg-utility',
      'through2',
      'gulp',
      'bluebird',
      'axios',
      'hexo-post-parser',
      'bluebird',
      'upath',
      'fs-extra'
    )
).filter((pkgName) => {
  return !['p-limit'].includes(pkgName);
});

export { tsconfig };
