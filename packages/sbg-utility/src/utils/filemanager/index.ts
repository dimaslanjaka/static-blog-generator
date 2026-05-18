// filemanager

export * from './copy';
export * from './del';
export * from './emptyDir';
export * from './getAppRootDir';
export * from './images';
export * from './path-utility';
export { normalizePath as joinPath, normalizePath as pathJoin } from './path-utility';
export * from './readDir';
export * from './readfile';
export * from './stream';
export * from './writefile';

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
