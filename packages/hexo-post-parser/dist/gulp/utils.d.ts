/// <reference types="node" />
import fs from 'fs';
/**
 * Loop dir recursive
 * @param destDir
 * @param debug
 */
export declare function loopDir(destDir: fs.PathLike | string, debug?: boolean): string[];
export declare function copyDir(source: string, dest: string, callback?: (err: any | null) => void): void;
/**
 * slash alternative
 * ```bash
 * npm i slash #usually
 * ```
 * @url {@link https://github.com/sindresorhus/slash}
 * @param path
 */
export declare function slash(path: string): string;
/**
 * check variable is empty, null, undefined, object/array length 0, number is 0
 * @param data
 * @returns
 */
export declare const isEmpty: (data: any) => boolean;
/**
 * Cacheable validate url is valid and http or https protocol
 * @param str
 * @returns
 */
export declare function isValidHttpUrl(str: string): any;
