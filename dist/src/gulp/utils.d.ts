/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import fs from 'fs';
import gulp from 'gulp';
/**
 * Crossplatform path replacer
 * @param str
 * @param from
 * @param to
 * @returns
 */
export declare function replacePath(str: string, from: string, to: string): string;
/**
 * shadow of gulp.dest
 */
export declare type GulpDest = gulp.DestMethod;
/**
 * Determine gulp.dest ({@link GulpDest}) location
 * @param pipe
 * @see import('gulp')
 * @returns
 */
export declare function determineDirname(pipe: NodeJS.ReadWriteStream): import("stream").Transform;
/**
 * Loop dir recursive
 * @param destDir
 * @param debug
 */
export declare function loopDir(destDir: fs.PathLike | string, debug?: boolean): string[];
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
