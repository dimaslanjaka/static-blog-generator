/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import Bluebird from 'bluebird';
import * as fs from 'fs-extra';
import upath from 'upath';
import ErrnoException = NodeJS.ErrnoException;
import glob = require('glob');
/**
 * cross-platform normalize path to fixed-case windows drive letters
 * @link https://www.npmjs.com/package/true-case-path
 * @param path
 * @returns unix-style path separator
 */
export declare function normalize(path: string): string;
/**
 * node_modules/.cache/${name}
 */
export declare const cacheDir: string;
export type Mutable<T> = {
    -readonly [k in keyof T]: T[k];
};
declare const filemanager: {
    readdirSync: (path: fs.PathLike, callback: (err: ErrnoException, results?: string[]) => any) => void;
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
     * @returns Promise.resolve(path);
     * @example
     * // write directly
     * const input = write('/folder/file.txt', {'a':'v'});
     * // log here
     * console.log('written successfully');
     * // or log using async
     * input.then((file)=> console.log('written to', file));
     */
    write: (path: fs.PathLike, content: any) => Bluebird<string | Buffer | import("url").URL>;
    /**
     * Make directory recursive default (only not exists dir)
     * @param path
     * @param options
     * @returns
     */
    mkdirSync: (path: fs.PathLike, options?: fs.MakeDirectoryOptions) => string;
};
export declare function removeMultiSlashes(str: string): string;
export declare const globSrc: (pattern: string, opts?: glob.IOptions) => Bluebird<string[]>;
export default filemanager;
export declare const writeFileSync: (path: fs.PathLike, content: any) => Bluebird<string | Buffer | import("url").URL>;
export declare const cwd: () => string;
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
export declare function read(path: string, opt?: Parameters<typeof fs.readFileSync>[1]): string | Buffer;
/**
 * smart join to unix path
 * * removes empty/null/undefined
 * @param str
 * @returns
 */
export declare const join: typeof upath.join;
export declare const write: (path: fs.PathLike, content: any) => Bluebird<string | Buffer | import("url").URL>, readdirSync: (path: fs.PathLike, callback: (err: ErrnoException, results?: string[]) => any) => void, rmdirSync: (path: fs.PathLike, options?: fs.RmOptions) => void, rm: (path: fs.PathLike, options?: fs.RmOptions | fs.NoParamCallback, callback?: fs.NoParamCallback) => void, mkdirSync: (path: fs.PathLike, options?: fs.MakeDirectoryOptions) => string;
export declare const fsreadDirSync: typeof fs.readdirSync;
export declare const existsSync: typeof fs.existsSync, readFileSync: typeof fs.readFileSync, appendFileSync: typeof fs.appendFileSync, statSync: fs.StatSyncFn;
export declare const basename: typeof upath.basename, relative: typeof upath.relative, extname: typeof upath.extname;
export declare const PATH_SEPARATOR: "/" | "\\";
