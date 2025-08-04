import fs from 'fs';
import * as glob from 'glob';
import path from 'upath';
import { fileURLToPath } from 'url';

/**
 * Generates the "exports" field for a package.json file based on built files in dist folders.
 *
 * @param {Object} [options] Options for export generation.
 * @param {string} [options.pkgPath] Path to the package.json file to update. Defaults to process cwd package.json.
 * @param {Object} [options.exportValues] Additional export entries to merge into the exports field.
 * @param {Array<{dir: string, prefix: string}>} [options.folders] Folders to scan for exports. Each folder should have a `dir` (absolute path) and a `prefix` (export path prefix). No default folders are used.
 * @returns {void}
 */
export function generateExports({
  pkgPath = path.join(process.cwd(), 'package.json'),
  exportValues = {},
  folders = []
} = {}) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const exportsObj = {};

  for (const folder of folders) {
    if (!fs.existsSync(folder.dir)) continue;
    // Use glob to find all .mjs, .cjs, .d.ts, .d.mts, .d.cts files
    const patterns = ['**/*.mjs', '**/*.cjs', '**/*.d.ts', '**/*.d.mts', '**/*.d.cts'];
    const files = patterns
      .flatMap((pattern) => glob.sync(pattern, { cwd: folder.dir, nodir: true }))
      .map((file) => path.join(folder.prefix, file));

    files.forEach((file) => {
      if (file.endsWith('.d.ts') || file.endsWith('.d.mts') || file.endsWith('.d.cts')) return;

      const withoutExt = file.replace(/\.(mjs|cjs|d\.ts|d\.mts|d\.cts)$/, '');
      const entry = {};
      if (fs.existsSync(path.join(process.cwd(), `${withoutExt}.d.ts`))) {
        entry.types = `./${withoutExt}.d.ts`;
      }
      if (file.endsWith('.mjs')) {
        entry.import = `./${file}`;
        if (fs.existsSync(path.join(process.cwd(), `${withoutExt}.d.mts`))) {
          entry.types = `./${withoutExt}.d.mts`;
        }
      } else if (file.endsWith('.cjs')) {
        entry.require = `./${file}`;
        if (fs.existsSync(path.join(process.cwd(), `${withoutExt}.d.cts`))) {
          entry.types = `./${withoutExt}.d.cts`;
        }
      }
      exportsObj[`./${file}`] = entry;
      exportsObj[`./${withoutExt}`] = {
        ...entry,
        ...(entry.import ? { import: entry.import } : {}),
        ...(entry.require ? { require: entry.require } : {}),
        ...(entry.types ? { types: entry.types } : {})
      };
      if (fs.existsSync(path.join(process.cwd(), `${withoutExt}.d.ts`))) {
        exportsObj[`./${withoutExt}`].types = `./${withoutExt}.d.ts`;
      }
      if (fs.existsSync(path.join(process.cwd(), `${withoutExt}.mjs`))) {
        exportsObj[`./${withoutExt}`].import = `./${withoutExt}.mjs`;
      }
      if (fs.existsSync(path.join(process.cwd(), `${withoutExt}.cjs`))) {
        exportsObj[`./${withoutExt}`].require = `./${withoutExt}.cjs`;
      }
    });
  }

  const unsortedExports = { ...exportsObj, ...exportValues };
  pkg.exports = Object.keys(unsortedExports)
    .sort()
    .reduce((acc, key) => {
      acc[key] = unsortedExports[key];
      return acc;
    }, {});
  // Reorder pkg fields to match typical package.json order
  const pkgOrder = [
    'name',
    'version',
    'description',
    'keywords',
    'homepage',
    'bugs',
    'license',
    'author',
    'contributors',
    'funding',
    'main',
    'module',
    'types',
    'exports',
    'files',
    'bin',
    'directories',
    'repository',
    'scripts',
    'config',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
    'engines',
    'os',
    'cpu',
    'private',
    'publishConfig'
  ];
  const orderedPkg = {};
  for (const key of pkgOrder) {
    if (key in pkg) orderedPkg[key] = pkg[key];
  }
  for (const key of Object.keys(pkg)) {
    if (!(key in orderedPkg)) orderedPkg[key] = pkg[key];
  }
  fs.writeFileSync(pkgPath, JSON.stringify(orderedPkg, null, 2) + '\n');
  console.log(`package.json "exports" field at "${pkgPath}" updated successfully.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateExports({ pkgPath: path.join(process.cwd(), 'tmp/package.json') });
}
