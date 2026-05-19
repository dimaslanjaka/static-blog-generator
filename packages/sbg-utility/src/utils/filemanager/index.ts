// filemanager

export * from './copy.js';
export * from './del.js';
export * from './emptyDir.js';
export * from './getAppRootDir.js';
export * from './images.js';
export * from './path-utility.js';
export { normalizePath as joinPath, normalizePath as pathJoin } from './path-utility.js';
export * from './readDir.js';
export * from './readfile.js';
export * from './stream.js';
export * from './writefile.js';

/**
 * is non-markdown file
 * @param assetPath
 * @returns
 */
export const isAsset = (assetPath: any) =>
  /.(js|css|scss|njk|ejs|png|jpe?g|gif|svg|webp|json|html|txt)$/.test(String(assetPath));

/**
 * is markdown file
 * @param markdownPath
 * @returns
 */
export const isMarkdown = (markdownPath: any) => /.(md)$/i.test(String(markdownPath));
