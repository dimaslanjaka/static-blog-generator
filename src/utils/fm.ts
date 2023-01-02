// filemanager

import fs, { MakeDirectoryOptions } from 'fs-extra';
import path from 'path';

export interface writefileOpt extends MakeDirectoryOptions {
  append?: boolean;
  async?: boolean;
}

export interface writefileResult {
  file: string;
  append: boolean;
}

/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 */
export function writefile(file: string, content: string): writefileResult;
/**
 * async write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
export function writefile(
  file: string,
  content: string,
  opt: { async?: true } & writefileOpt
): Promise<writefileResult>;
/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
export function writefile(file: string, content: string, opt: { async?: false } & writefileOpt): writefileResult;
/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
export function writefile(file: string, content: string, opt: writefileOpt = {}) {
  // create dirname when not exist
  if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), Object.assign({ recursive: true }, opt));
  const result = {
    file,
    append: false
  };
  if (opt.append) {
    result.append = true;
    fs.appendFileSync(file, content);
  } else {
    fs.writeFileSync(file, content);
  }
  if (opt.async) return Promise.resolve(result);
  return result;
}

/**
 * create writestream (auto create dirname)
 * @param dest
 * @param options
 * @returns
 */
export function createWriteStream(dest: string, options?: Parameters<typeof fs['createWriteStream']>[1]) {
  if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest));
  return fs.createWriteStream(dest, options);
}
