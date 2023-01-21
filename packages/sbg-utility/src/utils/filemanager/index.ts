// filemanager

import fs from 'fs-extra';
import path from 'upath';

export * from './del';
export * from './emptyDir';
export * from './readDir';
export * from './writefile';

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
