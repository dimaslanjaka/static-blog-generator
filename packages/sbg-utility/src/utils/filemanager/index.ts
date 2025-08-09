// filemanager

export * from './copy';
export * from './del';
export * from './emptyDir';
export * from './getAppRootDir';
export * from './images';
export * from './normalizePath';
export { normalizePath as joinPath, normalizePath as pathJoin } from './normalizePath';
export * from './readDir';
export * from './readfile';
export * from './stream';
export * from './writefile';

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
