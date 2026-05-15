import CryptoJS from 'crypto-js';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'upath';

/**
 * Calculate a checksum for the given target paths.
 * This checksum is used to determine if the source files have changed
 * and whether a build is necessary.
 *
 * @param targetPaths - An array of file or directory paths to include in the checksum.
 * @returns A SHA-256 hash of the contents of the specified files and directories.
 */
export function getChecksum(...targetPaths: string[]): string {
  const files: string[] = [];
  for (const pattern of targetPaths) {
    if (fs.existsSync(pattern)) {
      const stat = fs.statSync(pattern);
      if (stat.isFile()) {
        files.push(path.resolve(pattern));
      } else if (stat.isDirectory()) {
        const dirFiles = glob.sync('**/*', { cwd: pattern, nodir: true, absolute: true, dot: true });
        files.push(...dirFiles);
      }
    } else {
      // Check if the pattern is absolute path combination
      const dirname = path.dirname(pattern);
      const basename = path.basename(pattern);
      if (fs.existsSync(dirname) && fs.statSync(dirname).isDirectory()) {
        const matches = glob.sync(basename, { cwd: dirname, nodir: true, absolute: true, dot: true });
        files.push(...matches);
      } else {
        // If the pattern is not an absolute path, treat it as a glob pattern
        const matches = glob.sync(pattern, { nodir: true, absolute: true, dot: true });
        files.push(...matches);
      }
    }
  }
  const uniqueFiles = Array.from(new Set(files)).sort();
  const hash = CryptoJS.algo.SHA256.create();
  for (const file of uniqueFiles) {
    const fileBuffer = fs.readFileSync(file);
    const chunkSize = 1024 * 1024; // 1MB
    for (let offset = 0; offset < fileBuffer.length; offset += chunkSize) {
      const chunk = fileBuffer.subarray(offset, Math.min(offset + chunkSize, fileBuffer.length));
      hash.update(CryptoJS.lib.WordArray.create(chunk));
    }
  }
  return hash.finalize().toString(CryptoJS.enc.Hex);
}

export default getChecksum;
