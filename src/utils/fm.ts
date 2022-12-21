// filemanager

import { appendFileSync, existsSync, MakeDirectoryOptions, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export interface writefileOpt extends MakeDirectoryOptions {
  append?: boolean;
}

/**
 * write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
export function writefile(file: string, content: string, opt: writefileOpt = {}) {
  if (!existsSync(dirname(file))) mkdirSync(dirname(file), Object.assign({ recursive: true }, opt));
  if (opt.append) {
    return appendFileSync(file, content);
  }
  writeFileSync(file, content);
}
