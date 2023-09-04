import fs from 'fs-extra';
/**
 * copy file/folder recursively
 * @param src
 * @param dest
 * @param options
 * @returns
 */
export declare function copyPath(src: string, dest: string, options?: fs.CopyOptions): Promise<void>;
