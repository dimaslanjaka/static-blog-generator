import color from 'ansi-colors';
import fs from 'fs';
import jsonc from 'jsonc-parser';
import _ from 'lodash';
import path from 'upath';
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

/**
 * Packages that should be bundled (not externalized)
 * @type {string[]}
 */
const bundledPackages = [
  'p-limit',
  'deepmerge-ts',
  'hexo-is',
  'is-stream',
  'markdown-it',
  'node-cache',
  'is-file-stream'
];

/**
 * List external dependencies, excluding specific packages that should be bundled
 * @type {string[]}
 */
export const externalPackages = _.uniq(
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
).filter((pkgName, idx, arr) => !bundledPackages.includes(pkgName) && arr.indexOf(pkgName) === idx);

export { pkg as packageJson, tsconfig };

/**
 * Returns a function to generate entry file names with the given extension for Rollup output.
 *
 * For files from node_modules, places them in the dependencies folder and logs the mapping.
 *
 * @param {string} ext The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { facadeModuleId: string }) => string} Function that generates the output file name for a given entry.
 */
export function entryFileNamesWithExt(ext) {
  // Ensure the extension does not start with a dot
  if (ext.startsWith('.')) {
    ext = ext.slice(1);
  }
  return function ({ facadeModuleId }) {
    facadeModuleId = path.toUnix(facadeModuleId);
    if (!facadeModuleId.includes('node_modules')) {
      return `[name].${ext}`;
    }
    // Find the first occurrence of 'node_modules' and slice from there
    const nodeModulesIdx = facadeModuleId.indexOf('node_modules');
    let rel = facadeModuleId.slice(nodeModulesIdx);
    rel = rel.replace('node_modules', 'dependencies');
    // Remove extension using upath.extname
    rel = rel.slice(0, -path.extname(rel).length) + `.${ext}`;
    // Remove any null bytes (\x00) that may be present (Rollup sometimes injects these)
    rel = rel.replace(/\0/g, '');
    // Remove any leading slashes
    rel = rel.replace(/^\/\/+/, '');

    fs.appendFileSync(
      'tmp/rollup.log',
      `entryFileNamesWithExt:\n  [facadeModuleId] ${facadeModuleId}\n  [rel] ${rel}\n`
    );
    return rel;
  };
}

/**
 * Returns a function to generate chunk file names with the given extension for Rollup output.
 *
 * For chunks from node_modules, places them in the dependencies folder and removes the original extension.
 *
 * @param {string} ext The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { name: string }) => string} Function that generates the output file name for a given chunk.
 */
export function chunkFileNamesWithExt(ext) {
  return function ({ name }) {
    // For node_modules chunks, place in dependencies folder
    if (name && name.includes('node_modules')) {
      const nodeModulesIdx = name.indexOf('node_modules');
      let rel = name.slice(nodeModulesIdx);
      rel = rel.replace('node_modules', 'dependencies');
      // Remove extension using upath.extname
      rel = rel.slice(0, -path.extname(rel).length);
      // Remove any null bytes (\x00) that may be present
      rel = rel.replace(/\0/g, '');
      // Remove any leading slashes
      rel = rel.replace(/^\/\/+/, '');
      return `${rel}-[hash].${ext}`;
    }
    // For local chunks, keep the default pattern
    return `[name]-[hash].${ext}`;
  };
}

/**
 * Rollup external filter function.
 * Determines if a module should be treated as external (not bundled) or bundled.
 *
 * @param {string} source - The import path or module ID.
 * @param {string} importer - The path of the importing file.
 * @param {boolean} isResolved - Whether the import has been resolved.
 * @returns {boolean} True if the module should be external, false if it should be bundled.
 */
export function externalPackagesFilter(source, importer, isResolved) {
  function getPackageNameFromSource(source) {
    // Handle absolute paths (Windows/Unix)
    const nm = /node_modules[\\/]+([^\\/]+)(?:[\\/]+([^\\/]+))?/.exec(source);
    if (nm) {
      // Scoped package
      if (nm[1].startsWith('@') && nm[2]) {
        return nm[1] + '/' + nm[2];
      }
      return nm[1];
    }
    // Handle bare imports
    if (source.startsWith('@')) {
      return source.split('/').slice(0, 2).join('/');
    }
    return source.split('/')[0];
  }

  const pkgName = getPackageNameFromSource(source);
  const isBundled = bundledPackages.includes(pkgName);
  const isExternal = externalPackages.includes(pkgName);

  if (bundledPackages.some((pkg) => source.includes(pkg))) {
    // Helper to color booleans
    const boolColor = (val) => (val ? color.green('true') : color.red('false'));
    const treeLog = [
      color.bold(color.cyan('externalFilter')),
      `\t├─ ${color.cyan('source:')}     ${color.yellow(source)}`,
      `\t├─ ${color.cyan('pkgName:')}    ${color.yellow(pkgName)}`,
      `\t├─ ${color.cyan('external:')}   ${boolColor(isExternal)}`,
      `\t├─ ${color.cyan('bundled:')}    ${boolColor(isBundled)}`,
      `\t├─ ${color.cyan('importer:')}   ${color.yellow((importer || '-').replace(process.cwd(), '').replace(/^\//, ''))}`,
      `\t└─ ${color.cyan('isResolved:')} ${boolColor(isResolved)}`
    ].join('\n');
    console.log(treeLog);
  }

  if (isBundled) return false; // <-- force bundle
  if (isExternal) return true; // <-- mark as external
  return false; // fallback: bundle it
}
