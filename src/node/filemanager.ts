/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Bluebird from 'bluebird';
import findCacheDir from 'find-cache-dir';
import * as fs from 'fs';
import { default as nodePath } from 'path';
import { cwd as nodeCwd } from 'process';
import upath from 'upath';
import { removeEmpties } from './array-utils';
import { json_encode } from './JSON';

import glob = require('glob');
/**
 * node_modules/.cache/${name}
 */
export const cacheDir = findCacheDir({ name: 'dimaslanjaka' });

export type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};
const modPath = nodePath as Mutable<typeof nodePath>;
//modPath.sep = '/';

/**
 * Directory iterator recursive
 * @param dir
 * @see {@link https://stackoverflow.com/a/66083078/6404439}
 */
function* walkSync(dir: fs.PathLike): Generator<string> {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(join(dir, file.name));
    } else {
      yield join(dir, file.name);
    }
  }
}

const filemanager = {
  /**
   * @see {@link walkSync}
   */
  readdirSync: walkSync,

  /**
   * Remove dir or file recursive synchronously (non-empty folders supported)
   * @param path
   */
  rmdirSync: (path: fs.PathLike, options: fs.RmOptions = {}) => {
    if (fs.existsSync(path))
      return fs.rmSync(path, Object.assign({ recursive: true }, options));
  },

  /**
   * remove dir or file recursive asynchronously
   * @param path
   * @param options
   * @param callback
   * @returns
   */
  rm: (
    path: fs.PathLike,
    options: fs.RmOptions | fs.NoParamCallback = {},
    callback?: fs.NoParamCallback
  ) => {
    if (fs.existsSync(path)) {
      if (typeof options == 'function') {
        return fs.rm(path, { recursive: true }, options);
      } else if (typeof options == 'object') {
        return fs.rm(
          path,
          Object.assign({ recursive: true }, options),
          typeof callback == 'function'
            ? callback
            : () => {
                // no callback? do nothing
              }
        );
      }
    }
  },

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
  write: (path: fs.PathLike, content: any, append = false) => {
    const dir = modPath.dirname(path.toString());
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (typeof content != 'string') {
      if (typeof content == 'object') {
        content = json_encode(content, 4);
      } else {
        content = String(content);
      }
    }
    if (!append) {
      fs.writeFileSync(path, content);
    } else {
      fs.appendFileSync(path, content);
    }
    return Bluebird.resolve(path);
  },

  /**
   * Make directory recursive default (only not exists dir)
   * @param path
   * @param options
   * @returns
   */
  mkdirSync: (path: fs.PathLike, options: fs.MakeDirectoryOptions = {}) => {
    if (!fs.existsSync(path))
      return fs.mkdirSync(path, Object.assign({ recursive: true }, options));
  }
};

export function removeMultiSlashes(str: string) {
  return str.replace(/(\/)+/g, '$1');
}

export const globSrc = function (pattern: string, opts: glob.IOptions = {}) {
  return new Bluebird((resolve: (arg: string[]) => any, reject) => {
    const opt: glob.IOptions = Object.assign(
      { cwd: cwd(), dot: true, matchBase: true },
      opts
    );
    glob(pattern, opt, function (err, files) {
      if (err) {
        return reject(err);
      }
      resolve(files.map(upath.toUnix));
    });
  });
};

export default filemanager;
export const normalize = upath.normalize;
export const writeFileSync = filemanager.write;
export const cwd = () => upath.toUnix(nodeCwd());
export const dirname = (str: string) =>
  removeMultiSlashes(upath.toUnix(upath.dirname(str)));
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
export const resolve = (str: string, opt: ResolveOpt | any = {}) => {
  const res = removeMultiSlashes(upath.toUnix(upath.resolve(str)));
  opt = Object.assign(
    {
      validate: false
    },
    opt
  );
  if (opt.validate) {
    if (fs.existsSync(res)) return res;
    return null;
  }
  return res;
};
/**
 * nullable read file synchronous
 * @param path
 * @param opt
 * @returns
 */
export function read(path: string): Buffer;
export function read(path: string, opt?: BufferEncoding): string;
export function read(
  path: string,
  opt?: Parameters<typeof fs.readFileSync>[1]
): ReturnType<typeof fs.readFileSync> | null {
  if (fs.existsSync(path)) return fs.readFileSync(path, opt);
  return null;
}

/**
 * smart join to unix path
 * * removes empty/null/undefined
 * @param str
 * @returns
 */
export const join = (...str: any[]) => {
  str = removeEmpties(str.map((s) => String(s)));
  return removeMultiSlashes(upath.toUnix(nodePath.join(...str)));
};
export const { write, readdirSync, rmdirSync, rm, mkdirSync } = filemanager;
export const fsreadDirSync = fs.readdirSync;
export const { basename, relative, extname } = upath;
export const PATH_SEPARATOR = modPath.sep;
