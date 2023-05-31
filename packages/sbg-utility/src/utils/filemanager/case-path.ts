'use strict';

import { readdir as _readdir, existsSync, readdirSync } from 'fs-extra';
import { platform } from 'os';
import { isAbsolute, join, normalize } from 'path';
import { toUnix } from 'upath';
import { promisify as pify } from 'util';

const readdir = pify(_readdir);
export const isWindows = platform() === 'win32';
const delimiter = isWindows ? '\\' : '/';

export const trueCasePathSync = trueCasePathNew({ sync: true });
export const trueCasePath = trueCasePathNew({ sync: false });

interface trueCasePathNewOpt {
  /** synchronous */
  sync: boolean;
  debug?: boolean;
}
interface trueCasePathNewCallbackOpt {
  /** return as unix style path */
  unix?: boolean;
}

function trueCasePathNew(opt?: trueCasePathNewOpt) {
  const defaults = { sync: false };
  const trueCase = _trueCasePath(Object.assign(defaults, opt || {}));
  return (filePath: string, basePath?: string | trueCasePathNewCallbackOpt, cbOpt?: trueCasePathNewCallbackOpt) => {
    if (filePath.length > 3) {
      let result: string;
      let bPath: string | undefined = undefined;
      let callbackOpt: trueCasePathNewCallbackOpt = Object.assign({ unix: false }, cbOpt || {});
      if (typeof basePath === 'string') {
        bPath = basePath;
      } else if (typeof basePath === 'object') {
        callbackOpt = Object.assign({ unix: false }, basePath || {});
      }
      let fPath = filePath;
      if (typeof bPath === 'string') fPath = join(bPath, filePath);
      if (existsSync(fPath)) {
        result = trueCase(filePath, bPath);
      } else {
        result = fPath.trim().replace(/^[a-zA-Z]:/g, function (match) {
          return match.toUpperCase();
        });
      }
      if (callbackOpt?.unix) {
        return toUnix(result);
      } else {
        return result;
      }
    } else {
      if (typeof basePath === 'string') {
        if (opt?.debug) console.error('failed convert case-path of', { basePath, filePath });
        return join(basePath, filePath);
      } else {
        if (opt?.debug) console.error('failed convert case-path of', { filePath });
        return filePath;
      }
    }
  };
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

function _trueCasePath({ sync }: { sync: boolean }) {
  return (filePath: string, basePath?: string) => {
    if (!existsSync(filePath)) return basePath ? join(basePath, filePath) : filePath;
    if (basePath) {
      if (!isAbsolute(basePath)) {
        throw new Error(`[true-case-path]: basePath argument must be absolute. Received "${basePath}"`);
      }
      basePath = normalize(basePath);
    }
    filePath = normalize(filePath);
    const segments = getRelevantFilePathSegments(filePath);
    if (isAbsolute(filePath)) {
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

function iterateSync(basePath: string | undefined, filePath: string, segments: any[]) {
  return segments.reduce(
    (realPath, fileOrDirectory) =>
      realPath + delimiter + matchCaseInsensitive(fileOrDirectory, readdirSync(realPath + delimiter), filePath),
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
