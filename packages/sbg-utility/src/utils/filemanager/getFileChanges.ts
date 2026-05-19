import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'upath';
import { fileURLToPath } from 'url';
import { md5 } from '../hash.js';
import { getChecksum } from '../hash/getChecksum.js';

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

const __filename = fileURLToPath(import.meta.url);

/**
 * Normalize paths so cache is stable across:
 * - Windows/Linux/macOS
 * - different cwd styles
 * - slash direction
 * - casing inconsistencies
 */
function normalizeFilePath(file: string): string {
  // upath ensures consistent unix-style separators across platforms
  return path.toUnix(path.normalize(file));
}

export async function getFileChanges(options: GetFileChangesOptions = {}): Promise<GetFileChangesResult> {
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
    .filter((file) => normalizeFilePath(path.resolve(cwd, file)) !== normalizeFilePath(path.resolve(__filename)))
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
    const currentHash = await getChecksum(absoluteFile);

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
  fs.writeFileSync(cacheFile, JSON.stringify(allFiles, null, 2));

  return result;
}

export default getFileChanges;
