import fs from 'fs-extra';
import path from 'upath';

export interface writefileOpt extends fs.MakeDirectoryOptions {
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
/**
 * async write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
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

export { writefile as writeFile };
