import fs from 'fs';
import jsonc from 'jsonc-parser';
import _ from 'lodash';
import path from 'path';
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
export const external = _.uniq(
  Object.keys(pkg.dependencies)
    .concat(Object.keys(pkg.devDependencies))
    .concat(
      'hexo',
      'warehouse',
      'hexo-util',
      'canvas',
      'jsdom',
      'mime-types',
      'sbg-utility',
      'through2',
      'gulp',
      'bluebird',
      'upath',
      'fs-extra',
      'cheerio',
      'axios',
      'minimatch'
    )
).filter((pkgName) => {
  return !['p-limit', 'deepmerge-ts'].includes(pkgName);
});

export { tsconfig };
