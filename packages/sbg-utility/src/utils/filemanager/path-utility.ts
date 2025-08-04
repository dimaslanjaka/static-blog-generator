import fs from 'fs-extra';
import { platform } from 'os';
import path from 'path';
import upath from 'upath';
import { promisify as pify } from 'util';
import { fixDriveLetter } from './driveLetterUtils';

const readdir = pify(fs.readdir);
export const isWindows = platform() === 'win32';
const delimiter = isWindows ? '\\' : '/';

interface TrueCasePathNewCallbackOpt {
  /** return as unix style path */
  unix?: boolean;
}

// --- SYNC true-case-path ---
function iterateSync(basePath: string, filePath: string, segments: string[]): string {
  return segments.reduce(
    (realPath, fileOrDirectory) =>
      realPath + delimiter + matchCaseInsensitive(fileOrDirectory, fs.readdirSync(realPath + delimiter), filePath),
    basePath
  );
}

function trueCasePathSyncImpl(filePath: string, basePath?: string): string {
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
    basePath = isWindows ? segments.shift()?.toUpperCase() || '' : '';
  } else if (!basePath) {
    basePath = process.cwd();
  }
  return iterateSync(basePath, filePath, segments);
}

export function trueCasePathSync(
  filePath: string,
  basePath?: string | TrueCasePathNewCallbackOpt,
  cbOpt?: TrueCasePathNewCallbackOpt
): string {
  if (filePath.length > 3) {
    let bPath: string | undefined = undefined;
    let callbackOpt: TrueCasePathNewCallbackOpt = Object.assign({ unix: false }, cbOpt || {});
    if (typeof basePath === 'string') {
      bPath = basePath;
    } else if (typeof basePath === 'object') {
      callbackOpt = Object.assign({ unix: false }, basePath || {});
    }
    let fPath = filePath;
    if (typeof bPath === 'string') fPath = path.join(bPath, filePath);
    fPath = path.normalize(fPath);
    let result: string;
    if (fs.existsSync(fPath)) {
      result = trueCasePathSyncImpl(filePath, bPath);
    } else {
      result = fPath.replace(/^([a-zA-Z]):/, (match, driveLetter) => driveLetter.toUpperCase() + ':');
    }
    return callbackOpt?.unix ? upath.toUnix(result) : result;
  } else {
    if (typeof basePath === 'string') {
      return path.join(basePath, filePath);
    } else {
      return filePath;
    }
  }
}

// --- ASYNC true-case-path ---
async function iterateAsync(basePath: string, filePath: string, segments: string[]): Promise<string> {
  let realPath = basePath;
  for (const fileOrDirectory of segments) {
    realPath =
      realPath + delimiter + matchCaseInsensitive(fileOrDirectory, await readdir(realPath + delimiter), filePath);
  }
  return realPath;
}

export async function trueCasePath(
  filePath: string,
  basePath?: string | TrueCasePathNewCallbackOpt,
  cbOpt?: TrueCasePathNewCallbackOpt
): Promise<string> {
  if (filePath.length > 3) {
    let bPath: string | undefined = undefined;
    let callbackOpt: TrueCasePathNewCallbackOpt = Object.assign({ unix: false }, cbOpt || {});
    if (typeof basePath === 'string') {
      bPath = basePath;
    } else if (typeof basePath === 'object') {
      callbackOpt = Object.assign({ unix: false }, basePath || {});
    }
    let fPath = filePath;
    if (typeof bPath === 'string') fPath = path.join(bPath, filePath);
    fPath = path.normalize(fPath);
    let result: string;
    if (fs.existsSync(fPath)) {
      // Async version
      result = await (async () => {
        let base = bPath;
        let fp = filePath;
        if (!fs.existsSync(fp)) return base ? path.join(base, fp) : fp;
        if (base) {
          if (!path.isAbsolute(base)) {
            throw new Error(`[true-case-path]: basePath argument must be absolute. Received "${base}"`);
          }
          base = path.normalize(base);
        }
        fp = path.normalize(fp);
        const segments = getRelevantFilePathSegments(fp);
        if (path.isAbsolute(fp)) {
          if (base) {
            throw new Error('[true-case-path]: filePath must be relative when used with basePath');
          }
          base = isWindows ? segments.shift()?.toUpperCase() || '' : '';
        } else if (!base) {
          base = process.cwd();
        }
        return await iterateAsync(base, fp, segments);
      })();
    } else {
      result = fPath.replace(/^([a-zA-Z]):/, (match, driveLetter) => driveLetter.toUpperCase() + ':');
    }
    return callbackOpt?.unix ? upath.toUnix(result) : result;
  } else {
    if (typeof basePath === 'string') {
      return path.join(basePath, filePath);
    } else {
      return filePath;
    }
  }
}

/**
 * Normalizes a path and applies true-case-path if the file exists.
 * @param str Path segments
 * @returns Normalized path with correct case and drive letter
 */

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

/**
 * Removes the base path from the target path.
 * @param target Path to remove from
 * @param toRemove Base path to remove
 */
export function removeCwd(target: string, toRemove: string): string {
  return normalizePath(target).replace(toRemove, '');
}

/**
 * UNIX join path with auto create dirname when not exists
 * @param path
 * @returns
 */

/**
 * Joins paths and creates the directory if it does not exist.
 * @param paths Path segments
 * @returns Joined path
 */
export function joinSolve(...paths: string[]): string {
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
