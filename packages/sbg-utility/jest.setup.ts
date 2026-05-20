import ansi from 'ansi-colors';
import { createFromFile as createFileEntryCache } from 'file-entry-cache';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'upath';

/**
 * __dirname workaround for ESM modules (Node.js standard)
 */
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  quiet: true,
  override: true,
  path:
    [path.resolve(__dirname, '.env'), path.resolve(process.cwd(), '.env')].filter((p) => fs.existsSync(p))[0] ||
    undefined
});

function normalizeFilePath(file: string): string {
  return path.toUnix(path.normalize(file));
}

interface FileEntry {
  file: string;
  hash: string;
}

export default async function main() {
  const patterns = ['rollup.*', 'tsconfig*.json', 'src/**/*.{ts,js,cjs,mjs}'];

  const ignorePatterns = [
    '**/*export*',
    '**/*.builder*',
    '**/*.runner*',
    '**/*.direct*',
    '**/node_modules/**',
    '**/dist/**',
    '**/tmp/**',
    '**/coverage/**',
    '**/.git/**',
    '**/index.*',
    '**/test*/**',
    '**/*.test.*',
    '**/__tests__/**'
  ];

  const cacheDirectory = path.join(__dirname, 'tmp', 'sbg-utility', 'getFileChanges');

  const cacheFile = path.join(cacheDirectory, 'jest.setup.json');

  const cacheExists = fs.existsSync(cacheFile);

  const files = glob
    .sync(patterns, {
      cwd: __dirname,
      nodir: true,
      dot: true,
      ignore: ignorePatterns,
      absolute: false
    })
    .map(normalizeFilePath)
    .filter((file) => path.resolve(__dirname, file) !== path.resolve(__filename))
    .sort();

  const cache = createFileEntryCache(cacheFile, {
    cwd: __dirname,
    useCheckSum: true
  });

  const allFiles: FileEntry[] = [];
  const changedFiles: FileEntry[] = [];

  for (const file of files) {
    const descriptor = cache.getFileDescriptor(file, {
      useCheckSum: true
    });

    const hash = descriptor.meta.hash;

    const entry: FileEntry = {
      file,
      hash: typeof hash === 'string' ? hash : ''
    };

    allFiles.push(entry);

    if (descriptor.changed) {
      changedFiles.push(entry);
    }
  }

  const hasChanges = changedFiles.length > 0 || !cacheExists;

  if (!hasChanges) {
    console.log('✅\tNo relevant source files changed. Skipping build.');
    return;
  }

  console.log(
    `🛠️\tDetected changes in source files ${changedFiles
      .map((f) => ansi.yellow(path.relative(__dirname, f.file)))
      .join(', ')}. Running build...`
  );

  try {
    execSync('npm run build', {
      stdio: 'inherit',
      cwd: __dirname
    });

    /**
     * IMPORTANT:
     * Only persist cache AFTER successful build.
     *
     * If build fails:
     * - cache is NOT reconciled
     * - changed files remain "changed"
     * - next run will retry build correctly
     */
    cache.reconcile();

    console.log('🛠️\tBuild completed.');
  } catch (error) {
    console.error('❌\tBuild failed.' + (error instanceof Error ? error.message : String(error)));

    process.exit(1);
  }
}

main();
