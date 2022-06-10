/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import Bluebird from 'bluebird';
import * as fs from 'fs';
import upath from 'upath';
import glob = require('glob');
/**
 * node_modules/.cache/${name}
 */
export declare const cacheDir: string;
export declare type Mutable<T> = {
    -readonly [k in keyof T]: T[k];
};
/**
 * Directory iterator recursive
 * @param dir
 * @see {@link https://stackoverflow.com/a/66083078/6404439}
 */
declare function walkSync(dir: fs.PathLike): Generator<string>;
declare const filemanager: {
    /**
     * @see {@link walkSync}
     */
    readdirSync: typeof walkSync;
    /**
     * Remove dir or file recursive synchronously (non-empty folders supported)
     * @param path
     */
    rmdirSync: (path: fs.PathLike, options?: fs.RmOptions) => void;
    /**
     * remove dir or file recursive asynchronously
     * @param path
     * @param options
     * @param callback
     * @returns
     */
    rm: (path: fs.PathLike, options?: fs.RmOptions | fs.NoParamCallback, callback?: fs.NoParamCallback) => void;
    /**
     * Write to file recursively (synchronous)
     * @param path
     * @param content
     * @param append append to file?
     * @returns Promise.resolve(path);
     * @example
     * // write directly
     * const input = write('/folder/file.txt', {'a':'v'});
     * // log here
     * console.log('written successfully');
     * // or log using async
     * input.then((file)=> console.log('written to', file));
     */
    write: (path: fs.PathLike, content: any, append?: boolean) => Bluebird<string | Buffer | import("url").URL>;
    /**
     * Make directory recursive default (only not exists dir)
     * @param path
     * @param options
     * @returns
     */
    mkdirSync: (path: fs.PathLike, options?: fs.MakeDirectoryOptions) => string;
};
export declare function removeMultiSlashes(str: string): string;
/**
 * copy dir or file recursive
 * @param src source path of file or folder
 * @param dest destination path
 */
export declare function copy(src: string, dest: string): void;
/**
 * copy directory recursive
 * @param source
 * @param dest
 * @param callback
 * @returns
 */
export declare function copyDir(source: string, dest: string, callback?: (err: any | null) => void): void;
interface GlobSrcOptions extends glob.IOptions {
    /**
     * ignore pattern will be processed by minimatch
     */
    use?: 'minimatch';
}
/**
 * minimatch advanced filter single pattern
 * @see {@link https://codesandbox.io/s/minimatch-file-list-y22tf8?file=/src/index.js}
 * @param pattern
 * @param str
 * @returns
 */
export declare function minimatch_filter(pattern: string | RegExp, str: string): boolean;
/**
 * minimatch advanced filter multiple pattern
 * @see {@link https://codesandbox.io/s/minimatch-file-list-y22tf8?file=/src/index.js}
 * @param patterns
 * @param str
 * @returns
 * @example
 * ['unit/x', 'sh', 'xxx', 'shortcodes/xxx'].filter((file) => {
 *  const patterns = ["unit", "shortcodes"];
 *  return minimatch_array_filter(patterns, file);
 * }); // ['sh', 'xxx']
 */
export declare function minimatch_array_filter(patterns: string[], str: string): boolean;
/**
 * glob source (gulp.src like)
 * @param pattern
 * @param opts
 * @see {@link https://codesandbox.io/s/minimatch-file-list-y22tf8?file=/src/index.js}
 * @returns
 */
export declare const globSrc: (pattern: string, opts?: GlobSrcOptions) => Bluebird<string[]>;
export default filemanager;
export declare const normalize: typeof upath.normalize;
export declare const dirname: (str: string) => string;
interface ResolveOpt {
    [key: string]: any;
    /**
     * validate path exists, otherwise null
     */
    validate?: boolean;
}
/**
 * @see {@link upath.resolve}
 * @param str
 * @param opt
 * @returns
 */
export declare const resolve: (str: string, opt?: ResolveOpt | any) => string;
/**
 * nullable read file synchronous
 * @param path
 * @param opt
 * @returns
 */
export declare function read(path: string): Buffer;
export declare function read(path: string, opt?: BufferEncoding): string;
/**
 * smart join to unix path
 * * removes empty/null/undefined
 * @param str
 * @returns
 */
export declare const join: (...str: any[]) => string;
export declare const write: (path: fs.PathLike, content: any, append?: boolean) => Bluebird<string | Buffer | import("url").URL>, readdirSync: typeof walkSync, rmdirSync: (path: fs.PathLike, options?: fs.RmOptions) => void, rm: (path: fs.PathLike, options?: fs.RmOptions | fs.NoParamCallback, callback?: fs.NoParamCallback) => void, mkdirSync: (path: fs.PathLike, options?: fs.MakeDirectoryOptions) => string;
export declare const fsreadDirSync: typeof fs.readdirSync;
export declare const basename: typeof upath.basename, relative: typeof upath.relative, extname: typeof upath.extname;
export declare const PATH_SEPARATOR: string;
