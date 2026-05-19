import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { md5 } from '../hash.js';
import { getChecksum } from '../hash/getChecksum.js';
import { writefile } from '../filemanager/writefile.js';

interface FileEntry {
  file: string;
  hash: string;
}

interface GetFileChangesOptions {
  /** Glob patterns to match files */
  patterns?: string | string[];

  /** Glob patterns to ignore */
  ignorePatterns?: string | string[];

  /** Current working directory */
  cwd?: string;
}

interface GetFileChangesResult {
  allFiles: FileEntry[];
  changedFiles: FileEntry[];
  result: boolean;
}

/**
 * Normalize paths so cache is stable across:
 * - Windows/Linux/macOS
 * - different cwd styles
 * - slash direction
 * - casing inconsistencies
 */
function normalizeFilePath(file: string): string {
  return path.posix.normalize(file.replace(/\\/g, '/'));
}

export function getFileChanges(options: GetFileChangesOptions = {}): GetFileChangesResult {
  const {
    patterns = 'src/**/*.{ts,js,cjs,mjs}',
    ignorePatterns = ['**/*export*', '**/*.builder*', '**/*.runner*', '**/*.direct*'],
    cwd = process.cwd()
  } = options;

  /**
   * Stable cache filename
   */
  const cacheKey = md5(
    JSON.stringify({
      patterns,
      ignorePatterns,
      cwd: normalizeFilePath(path.resolve(cwd))
    })
  );

  const cacheFile = path.join(cwd, 'tmp', 'sbg-utility', 'getFileChanges', `${cacheKey}.json`);

  /**
   * IMPORTANT:
   * Use relative paths instead of absolute paths.
   * Absolute paths frequently change across environments.
   */
  const files = glob
    .sync(patterns, {
      cwd,
      nodir: true,
      dot: true,
      ignore: ignorePatterns,
      absolute: false
    })
    .map(normalizeFilePath)
    .sort();

  const allFiles: FileEntry[] = [];
  const changedFiles: FileEntry[] = [];

  /**
   * Load previous cache
   */
  let previousData: FileEntry[] = [];

  if (fs.existsSync(cacheFile)) {
    try {
      const content = fs.readFileSync(cacheFile, 'utf8');

      const parsed = JSON.parse(content);

      if (Array.isArray(parsed)) {
        previousData = parsed;
      }
    } catch (err) {
      console.warn('Failed to read cache file:', err);
    }
  }

  /**
   * O(1) lookup map
   */
  const previousMap = new Map<string, string>();

  for (const entry of previousData) {
    previousMap.set(normalizeFilePath(entry.file), entry.hash);
  }

  /**
   * Detect changes
   */
  for (const relativeFile of files) {
    const absoluteFile = path.join(cwd, relativeFile);

    /**
     * IMPORTANT:
     * getChecksum should hash FILE CONTENT ONLY.
     */
    const currentHash = getChecksum(absoluteFile);

    const previousHash = previousMap.get(relativeFile);

    const entry: FileEntry = {
      file: relativeFile,
      hash: currentHash
    };

    allFiles.push(entry);

    if (!previousHash || previousHash !== currentHash) {
      changedFiles.push(entry);
    }
  }

  const result: GetFileChangesResult = {
    allFiles,
    changedFiles,
    result: changedFiles.length > 0 || !fs.existsSync(cacheFile)
  };

  /**
   * Ensure cache directory exists
   */
  fs.mkdirSync(path.dirname(cacheFile), {
    recursive: true
  });

  /**
   * Write stable cache
   */
  writefile(cacheFile, JSON.stringify(allFiles, null, 2));

  return result;
}

export default getFileChanges;
