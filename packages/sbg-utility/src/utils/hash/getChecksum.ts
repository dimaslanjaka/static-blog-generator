import CryptoJS from 'crypto-js';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'upath';

function normalizePath(file: string): string {
  return path.normalizeSafe(file).replace(/\\/g, '/').toLowerCase();
}

function collectFiles(targetPaths: string[]): string[] {
  const files: string[] = [];

  for (const target of targetPaths) {
    if (fs.existsSync(target)) {
      const stat = fs.statSync(target);

      if (stat.isFile()) {
        files.push(path.resolve(target));
        continue;
      }

      if (stat.isDirectory()) {
        const dirFiles = glob.sync('**/*', {
          cwd: target,
          nodir: true,
          absolute: true,
          dot: true
        });

        files.push(...dirFiles);
        continue;
      }
    }

    /**
     * Treat as glob pattern
     */
    const matches = glob.sync(target, {
      nodir: true,
      absolute: true,
      dot: true
    });

    files.push(...matches);
  }

  /**
   * Normalize + dedupe + stable sort
   */
  return Array.from(new Set(files.map((file) => normalizePath(path.resolve(file))))).sort((a, b) => a.localeCompare(b));
}

/**
 * CONTENT-ONLY checksum
 */
export function getChecksum(...targetPaths: string[]): string {
  const files = collectFiles(targetPaths);

  const hash = CryptoJS.algo.SHA256.create();

  for (const file of files) {
    const buffer = fs.readFileSync(file);

    /**
     * Include path in hash
     * so renaming files changes checksum
     */
    hash.update(CryptoJS.enc.Utf8.parse(file));

    const chunkSize = 1024 * 1024;

    for (let offset = 0; offset < buffer.length; offset += chunkSize) {
      const chunk = buffer.subarray(offset, Math.min(offset + chunkSize, buffer.length));

      hash.update(CryptoJS.lib.WordArray.create(chunk));
    }
  }

  return hash.finalize().toString(CryptoJS.enc.Hex);
}

export function getChecksumWithOptions(
  options: {
    ignorePatterns?: string[];
  } = {},
  ...targetPaths: string[]
): string {
  const ignorePatterns = options.ignorePatterns ?? [];

  const files = collectFiles(targetPaths);

  const filteredFiles = files.filter((file) => {
    return !ignorePatterns.some((pattern) => {
      /**
       * glob ignore
       */
      if (glob.hasMagic(pattern)) {
        return glob
          .sync(pattern, {
            nodir: true,
            absolute: true,
            dot: true
          })
          .map((x) => normalizePath(path.resolve(x)))
          .includes(file);
      }

      /**
       * substring ignore
       */
      return file.includes(normalizePath(pattern));
    });
  });

  const hash = CryptoJS.algo.SHA256.create();

  for (const file of filteredFiles) {
    const buffer = fs.readFileSync(file);

    /**
     * Include normalized path
     */
    hash.update(CryptoJS.enc.Utf8.parse(file));

    const chunkSize = 1024 * 1024;

    for (let offset = 0; offset < buffer.length; offset += chunkSize) {
      const chunk = buffer.subarray(offset, Math.min(offset + chunkSize, buffer.length));

      hash.update(CryptoJS.lib.WordArray.create(chunk));
    }
  }

  return hash.finalize().toString(CryptoJS.enc.Hex);
}

export default getChecksum;
