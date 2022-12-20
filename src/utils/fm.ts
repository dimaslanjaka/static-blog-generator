// filemanager

import { existsSync, MakeDirectoryOptions, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

/**
 * write to file recursively
 * @param file
 * @param content
 * @param opt
 */
export function writefile(file: string, content: string, opt: MakeDirectoryOptions = {}) {
  if (!existsSync(dirname(file))) mkdirSync(dirname(file), Object.assign({ recursive: true }, opt));
  writeFileSync(file, content);
}
