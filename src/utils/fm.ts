// filemanager

import { appendFileSync, existsSync, MakeDirectoryOptions, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

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
  if (!existsSync(dirname(file))) mkdirSync(dirname(file), Object.assign({ recursive: true }, opt));
  const result = {
    file,
    append: false
  };
  if (opt.append) {
    result.append = true;
    appendFileSync(file, content);
  } else {
    writeFileSync(file, content);
  }
  if (opt.async) return Promise.resolve(result);
  return result;
}
