import fs from 'fs';
import * as glob from 'glob';
import path from 'upath';
import { fileURLToPath } from 'url';

/**
 * Generates the "exports" field for a package.json file based on built files in dist folders.
 *
 * @param {Object} [options] Options for export generation.
 * @param {string} [options.pkgPath=path.join(process.cwd(), 'package.json')] Path to the package.json file to update.
 * @param {Object} [options.exportValues={}] Additional export entries to merge into the exports field.
 * @param {boolean} [options.useDefaultExport=true] Whether to include the default export entries.
 * @param {Array<{dir: string, prefix: string}>} [options.folders=[]] Additional folders to scan for exports. Each folder should have a `dir` (absolute path) and a `prefix` (export path prefix).
 * @param {boolean} [options.useDefaultFolders=true] Whether to include the default dist folders (utils, sitemap-crawler, gulp-utils).
 * @returns {void}
 */
export function generateExports({
  pkgPath = path.join(process.cwd(), 'package.json'),
  exportValues = {},
  useDefaultExport = true,
  folders = [],
  useDefaultFolders = true
} = {}) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const defaultExport = {
    '.': {
      require: {
        default: './dist/index.cjs',
        types: './dist/index.d.cts'
      },
      import: {
        default: './dist/index.mjs',
        types: './dist/index.d.mts'
      }
    },
    './package.json': './package.json'
  };
  const defaultFolders = [
    { dir: `${process.cwd()}/dist/utils`, prefix: './dist/utils/' },
    { dir: `${process.cwd()}/dist/sitemap-crawler`, prefix: './dist/sitemap-crawler/' },
    { dir: `${process.cwd()}/dist/gulp-utils`, prefix: './dist/gulp-utils/' }
  ].map((folder) => ({
    dir: path.resolve(folder.dir),
    prefix: folder.prefix
  }));

  const exportsObj = {};

  // Collect files from multiple folders
  const allFolders = useDefaultFolders ? [...defaultFolders, ...folders] : folders;

  for (const folder of allFolders) {
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

  const unsortedExports = useDefaultExport ? { ...defaultExport, ...exportsObj, ...exportValues } : { ...exportsObj };
  // Sort keys in exports
  pkg.exports = Object.keys(unsortedExports)
    .sort()
    .reduce((acc, key) => {
      acc[key] = unsortedExports[key];
      return acc;
    }, {});
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(`package.json "exports" field at "${pkgPath}" updated successfully.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateExports({ pkgPath: path.join(process.cwd(), 'tmp/package.json') });
}
