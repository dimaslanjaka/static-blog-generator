import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getChecksum, md5, writefile } from '..';

/**
 * __dirname workaround for ESM modules (Node.js standard)
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface FileEntry {
  file: string;
  hash: string;
}

interface GetFileChangesOptions {
  /** Glob patterns to match files */
  patterns?: string | string[];
  /** Glob patterns to ignore */
  ignorePatterns?: string | string[];
  /** Current working directory for the search */
  cwd?: string;
}

interface GetFileChangesResult {
  allFiles: FileEntry[];
  changedFiles: FileEntry[];
  result: boolean;
}

export function getFileChanges(options: GetFileChangesOptions = {}): GetFileChangesResult {
  // Destructure options with defaults matching the original hardcoded values
  const {
    patterns = 'src/**/*.{ts,js,cjs,mjs}',
    ignorePatterns = ['**/export*', '**/*.builder*', '**/*.runner*', '**/*.direct*'],
    cwd = process.cwd()
  } = options;

  // Resolve the cache path relative to the provided cwd (or process.cwd)
  const cacheFile = path.join(
    cwd,
    'tmp/sbg-utility/getFileChanges',
    md5(patterns + JSON.stringify(ignorePatterns) + cwd) + '.json'
  );

  // Find files based on patterns and options
  const files = glob.sync(patterns, {
    nodir: true,
    absolute: true,
    dot: true,
    ignore: ignorePatterns,
    cwd: cwd
  });

  const allFiles: FileEntry[] = [];
  const changedFiles: FileEntry[] = [];

  // Load previous cache
  let previousData: FileEntry[] = [];
  if (fs.existsSync(cacheFile)) {
    try {
      const content = fs.readFileSync(cacheFile, 'utf8');
      previousData = JSON.parse(content);
    } catch (e) {
      console.warn('Failed to parse cache file, ignoring.', e);
    }
  }

  // Optimization: Create a Map for O(1) lookups of previous hashes
  const previousMap = new Map(previousData.map((entry) => [entry.file, entry.hash]));

  for (const file of files) {
    const currentHash = getChecksum(file);
    const previousHash = previousMap.get(file);

    // If file is new or hash has changed
    if (!previousHash || previousHash !== currentHash) {
      changedFiles.push({ file, hash: currentHash });
    }

    allFiles.push({ file, hash: currentHash });
  }

  const result = { allFiles, changedFiles, result: changedFiles.length > 0 || !fs.existsSync(cacheFile) };

  // Ensure cache directory exists before writing
  const cacheDir = path.dirname(cacheFile);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  writefile(cacheFile, JSON.stringify(allFiles));
  return result;
}

export default getFileChanges;

// Example Usage:
// const changes = getFileChanges({
//   patterns: 'src/**/*.ts',
//   ignorePatterns: ['**/*.test.ts'],
//   cwd: process.cwd()
// });

// console.log('Changed files:', changes.changedFiles);
// console.log('Any changes detected:', changes.result);
