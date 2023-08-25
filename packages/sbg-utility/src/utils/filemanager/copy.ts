import fs from 'fs-extra';
import path from 'path';

/**
 * copy file/folder recursively
 * @param src
 * @param dest
 * @param options
 * @returns
 */
export function copyPath(src: string, dest: string, options?: fs.CopyOptions) {
  if (!fs.existsSync(path.dirname(dest))) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
  }
  return fs.copy(
    src,
    dest,
    Object.assign({ overwrite: true, dereference: true, errorOnExist: false } as fs.CopyOptions, options || {})
  );
}
