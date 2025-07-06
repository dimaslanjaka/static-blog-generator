import fs from 'fs-extra';
import { platform } from 'os';
import path from 'path';
import upath from 'upath';
import { promisify as pify } from 'util';
import Logger from '../logger';
import { fixDriveLetter } from './driveLetterUtils';

const readdir = pify(fs.readdir);
export const isWindows = platform() === 'win32';
const delimiter = isWindows ? '\\' : '/';

interface TrueCasePathNewOpt {
  /** synchronous */
  sync: boolean;
  debug?: boolean;
}
interface TrueCasePathNewCallbackOpt {
  /** return as unix style path */
  unix?: boolean;
}

function trueCasePathNew(opt?: TrueCasePathNewOpt) {
  const defaults = { sync: false };

  function iterateSync(basePath: string | undefined, filePath: string, segments: any[]) {
    return segments.reduce(
      (realPath, fileOrDirectory) =>
        realPath + delimiter + matchCaseInsensitive(fileOrDirectory, fs.readdirSync(realPath + delimiter), filePath),
      basePath
    );
  }

  async function iterateAsync(basePath: string | undefined, filePath: string, segments: any[]) {
    return await segments.reduce(
      async (realPathPromise, fileOrDirectory) =>
        (await realPathPromise) +
        delimiter +
        matchCaseInsensitive(fileOrDirectory, await readdir((await realPathPromise) + delimiter), filePath),
      basePath
    );
  }

  function _trueCasePath({ sync }: { sync: boolean }) {
    return (filePath: string, basePath?: string) => {
      if (!fs.existsSync(filePath)) return basePath ? path.join(basePath, filePath) : filePath;
      if (basePath) {
        if (!path.isAbsolute(basePath)) {
          throw new Error(`[true-case-path]: basePath argument must be absolute. Received "${basePath}"`);
        }
        basePath = path.normalize(basePath);
      }
      filePath = path.normalize(filePath);
      const segments = getRelevantFilePathSegments(filePath);
      if (path.isAbsolute(filePath)) {
        if (basePath) {
          throw new Error('[true-case-path]: filePath must be relative when used with basePath');
        }
        basePath = isWindows
          ? segments.shift()?.toUpperCase() // drive letter
          : '';
      } else if (!basePath) {
        basePath = process.cwd();
      }
      return sync ? iterateSync(basePath, filePath, segments) : iterateAsync(basePath, filePath, segments);
    };
  }

  const trueCase = _trueCasePath(Object.assign(defaults, opt || {}));

  return (filePath: string, basePath?: string | TrueCasePathNewCallbackOpt, cbOpt?: TrueCasePathNewCallbackOpt) => {
    if (filePath.length > 3) {
      let result: string;
      let bPath: string | undefined = undefined;
      let callbackOpt: TrueCasePathNewCallbackOpt = Object.assign({ unix: false }, cbOpt || {});

      if (typeof basePath === 'string') {
        bPath = basePath;
      } else if (typeof basePath === 'object') {
        callbackOpt = Object.assign({ unix: false }, basePath || {});
      }

      // Join basePath if provided
      let fPath = filePath;
      if (typeof bPath === 'string') fPath = path.join(bPath, filePath);

      // Normalize the path before any checks
      fPath = path.normalize(fPath);

      // Check if the file exists
      if (fs.existsSync(fPath)) {
        result = trueCase(filePath, bPath);
      } else {
        // Only capitalize the drive letter, don't touch the rest of the path
        result = fPath.replace(/^([a-zA-Z]):/, (match, driveLetter) => {
          return driveLetter.toUpperCase() + ':';
        });
      }

      // Handle Unix conversion if requested
      if (callbackOpt?.unix) {
        return upath.toUnix(result);
      } else {
        return result;
      }
    } else {
      // Error handling for invalid paths
      if (typeof basePath === 'string') {
        if (opt?.debug) Logger.error('Failed to convert case-path of', { basePath, filePath });
        return path.join(basePath, filePath);
      } else {
        if (opt?.debug) Logger.error('Failed to convert case-path of', { filePath });
        return filePath;
      }
    }
  };
}

export const trueCasePathSync = trueCasePathNew({ sync: true });
export const trueCasePath = trueCasePathNew({ sync: false });

/**
 * Normalizes a path and applies true-case-path if the file exists.
 * @param str Path segments
 * @returns Normalized path with correct case and drive letter
 */
export function normalizePath(...str: string[]): string {
  const join = path.join(...str);
  if (fs.existsSync(join)) {
    const casePath = trueCasePathSync(join);
    return fixDriveLetter(casePath);
  } else {
    return fixDriveLetter(join);
  }
}

/**
 * Normalizes a path to Unix style and applies true-case-path if the file exists.
 * @param str Path segments
 * @returns Unix style normalized path with correct case and drive letter
 */
export function normalizePathUnix(...str: string[]): string {
  const join = upath.join(...str);
  if (fs.existsSync(join)) {
    const casePath = trueCasePathSync(join);
    return fixDriveLetter(upath.toUnix(casePath));
  } else {
    return fixDriveLetter(join);
  }
}

/**
 * remove base path
 * @param target path to remove
 * @param toRemove cwd
 */
export function removeCwd(target: string, toRemove: string) {
  return normalizePath(target).replace(toRemove, '');
}

/**
 * UNIX join path with auto create dirname when not exists
 * @param path
 * @returns
 */
export function joinSolve(...paths: string[]) {
  const merge = normalizePath(...paths);
  if (!fs.existsSync(upath.dirname(merge))) {
    fs.mkdirSync(upath.dirname(merge), { recursive: true });
  }
  return merge;
}

function getRelevantFilePathSegments(filePath: string) {
  return filePath.split(delimiter).filter((s) => s !== '');
}

function escapeString(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchCaseInsensitive(fileOrDirectory: string, directoryContents: string[], filePath: string) {
  const caseInsensitiveRegex = new RegExp(`^${escapeString(fileOrDirectory)}$`, 'i');
  for (const file of directoryContents) {
    if (caseInsensitiveRegex.test(file)) return file;
  }
  throw new Error(`[true-case-path]: Called with ${filePath}, but no matching file exists`);
}
