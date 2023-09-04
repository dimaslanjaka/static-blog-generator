import * as fs from 'fs-extra';
import * as path from 'upath';

/**
 * create writestream (auto create dirname)
 * @param dest
 * @param options
 * @returns
 */
export function createWriteStream(dest: string, options?: Parameters<(typeof fs)['createWriteStream']>[1]) {
  if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest));
  return fs.createWriteStream(dest, options);
}
