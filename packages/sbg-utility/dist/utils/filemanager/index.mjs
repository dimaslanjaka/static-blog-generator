export { copyPath } from './copy.mjs';
export { del } from './del.mjs';
export { emptyDir } from './emptyDir.mjs';
export { getAppRootDir } from './getAppRootDir.mjs';
export { image_base64_encode } from './images.mjs';
export { fixDriveLetter, normalizePath as joinPath, joinSolve, normalizePath, normalizePathUnix, normalizePath as pathJoin, removeCwd } from './normalizePath.mjs';
export { readDir, readDirAsync } from './readDir.mjs';
export { createWriteStream } from './stream.mjs';
export { writefile } from './writefile.mjs';

// filemanager
/**
 * is non-markdown file
 * @param path
 * @returns
 */
const isAsset = (path) => /.(js|css|scss|njk|ejs|png|jpe?g|gif|svg|webp|json|html|txt)$/.test(String(path));
/**
 * is markdown file
 * @param path
 * @returns
 */
const isMarkdown = (path) => /.(md)$/i.test(String(path));

export { isAsset, isMarkdown };
