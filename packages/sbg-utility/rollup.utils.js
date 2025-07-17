import fs from 'fs';
import jsonc from 'jsonc-parser';
import _ from 'lodash';
import path from 'path';
import upath from 'upath';
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
      'mime-db',
      'sbg-utility',
      'through2',
      'gulp',
      'bluebird'
    )
).filter((pkgName) => {
  return !['p-limit', 'deepmerge-ts', 'hexo-is', 'markdown-it', 'is-stream', 'is-file-stream'].includes(pkgName);
});

export { tsconfig };

/**
 * Returns a function to generate entry file names with the given extension for Rollup output.
 * For node_modules, places in dependencies folder and logs the mapping.
 * @param {string} ext - The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { facadeModuleId: string }) => string}
 */
export function entryFileNamesWithExt(ext) {
  // Ensure the extension does not start with a dot
  if (ext.startsWith('.')) {
    ext = ext.slice(1);
  }
  return function ({ facadeModuleId }) {
    if (!facadeModuleId.includes('node_modules')) {
      return `[name].${ext}`;
    }
    let rel = upath.relative(upath.resolve(__dirname, 'tmp/dist'), facadeModuleId);
    rel = rel.replace('node_modules', 'dependencies');
    rel = rel.replace(/^(?:\.{2}\/|\.\/)+/, '');
    // Remove extension using upath.extname
    rel = rel.slice(0, -upath.extname(rel).length) + `.${ext}`;

    fs.appendFileSync('tmp/rollup.log', `Processed: ${facadeModuleId} -> ${rel}\n`);
    return rel;
  };
}

/**
 * Returns a function to generate chunk file names with the given extension for Rollup output.
 * For node_modules chunks, places in dependencies folder and removes extension.
 * @param {string} ext - The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { name: string }) => string}
 */
export function chunkFileNamesWithExt(ext) {
  return function ({ name }) {
    // For node_modules chunks, place in dependencies folder
    if (name && name.includes('node_modules')) {
      let rel = name.replace('node_modules', 'dependencies');
      rel = rel.replace(/^(?:\.\/|\.\.\/)+/, '');
      // Remove extension using upath.extname
      rel = rel.slice(0, -upath.extname(rel).length);
      return `${rel}-[hash].${ext}`;
    }
    // For local chunks, keep the default pattern
    return `[name]-[hash].${ext}`;
  };
}
