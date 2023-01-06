/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import Bluebird from 'bluebird';
import * as fs from 'fs-extra';
import upath from 'upath';
import ErrnoException = NodeJS.ErrnoException;
import glob = require('glob');
export declare function normalize(path: string): string;
export declare const cacheDir: string;
export type Mutable<T> = {
    -readonly [k in keyof T]: T[k];
};
declare const filemanager: {
    readdirSync: (path: fs.PathLike, callback: (err: ErrnoException, results?: string[]) => any) => void;
    rmdirSync: (path: fs.PathLike, options?: fs.RmOptions) => void;
    rm: (path: fs.PathLike, options?: fs.RmOptions | fs.NoParamCallback, callback?: fs.NoParamCallback) => void;
    write: (path: fs.PathLike, content: any) => Bluebird<string | Buffer | import("url").URL>;
    mkdirSync: (path: fs.PathLike, options?: fs.MakeDirectoryOptions) => void;
};
export declare function removeMultiSlashes(str: string): string;
export declare const globSrc: (pattern: string, opts?: glob.IOptions) => Bluebird<string[]>;
export default filemanager;
export declare const writeFileSync: (path: fs.PathLike, content: any) => Bluebird<string | Buffer | import("url").URL>;
export declare const cwd: () => string;
export declare const dirname: (str: string) => string;
interface ResolveOpt {
    [key: string]: any;
    validate?: boolean;
}
export declare const resolve: (str: string, opt?: ResolveOpt | any) => string | null;
export declare function read(path: string, opt?: Parameters<typeof fs.readFileSync>[1]): string | Buffer | null;
export declare const join: typeof upath.join;
export declare const write: (path: fs.PathLike, content: any) => Bluebird<string | Buffer | import("url").URL>, readdirSync: (path: fs.PathLike, callback: (err: ErrnoException, results?: string[]) => any) => void, rmdirSync: (path: fs.PathLike, options?: fs.RmOptions) => void, rm: (path: fs.PathLike, options?: fs.RmOptions | fs.NoParamCallback, callback?: fs.NoParamCallback) => void, mkdirSync: (path: fs.PathLike, options?: fs.MakeDirectoryOptions) => void;
export declare const fsreadDirSync: typeof fs.readdirSync;
export declare const existsSync: typeof fs.existsSync, readFileSync: typeof fs.readFileSync, appendFileSync: typeof fs.appendFileSync, statSync: fs.StatSyncFn;
export declare const basename: typeof upath.basename, relative: typeof upath.relative, extname: typeof upath.extname;
export declare const PATH_SEPARATOR: "/" | "\\";
