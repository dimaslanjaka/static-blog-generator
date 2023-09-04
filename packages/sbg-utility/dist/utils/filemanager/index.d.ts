export * from './copy';
export * from './del';
export * from './emptyDir';
export * from './getAppRootDir';
export * from './images';
export * from './normalizePath';
export { normalizePath as joinPath, normalizePath as pathJoin } from './normalizePath';
export * from './readDir';
export * from './stream';
export * from './writefile';
/**
 * is non-markdown file
 * @param path
 * @returns
 */
export declare const isAsset: (path: any) => boolean;
/**
 * is markdown file
 * @param path
 * @returns
 */
export declare const isMarkdown: (path: any) => boolean;
