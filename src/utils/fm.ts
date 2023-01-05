// filemanager

import fs, { MakeDirectoryOptions } from 'fs-extra';
import path from 'path';

export interface writefileOpt extends MakeDirectoryOptions {
  append?: boolean | undefined | null;
  async?: boolean | undefined | null;
}

export interface writefileResult {
  file: string;
  append: boolean;
}

export type strORobj = string | Record<string, any>;

/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 */
export function writefile(file: string, content: strORobj): writefileResult;
export function writefile(
  file: string,
  content: strORobj,
  opt: { append: boolean; async: undefined | null }
): writefileResult;
/**
 * async write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
export function writefile(file: string, content: strORobj, opt: { async: true }): Promise<writefileResult>;
export function writefile(
  file: string,
  content: strORobj,
  opt: { async: true; append: boolean | undefined | null }
): Promise<writefileResult>;

/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
export function writefile(
  file: string,
  content: strORobj,
  opt: { async?: false | undefined | null; append?: boolean }
): writefileResult;
/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
export function writefile(file: string, content: strORobj, opt: writefileOpt = {}) {
  // create dirname when not exist
  if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), Object.assign({ recursive: true }, opt));
  const result = {
    file,
    append: false
  };
  // transform object
  if (typeof content === 'object') {
    content = JSON.stringify(content, null, 2);
  }
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

/**
 * is non-markdown file
 * @param path
 * @returns
 */
export const isAsset = (path: any) => /.(js|css|scss|njk|ejs|png|jpe?g|gif|svg|webp|json|html|txt)$/.test(String(path));
/**
 * is markdown file
 * @param path
 * @returns
 */
export const isMarkdown = (path: any) => /.(md)$/i.test(String(path));
