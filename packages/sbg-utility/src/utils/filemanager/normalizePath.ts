import fs from 'fs-extra';
import path from 'path';
import upath from 'upath';
import { trueCasePathSync } from './case-path';
import { fixDriveLetter } from './driveLetterUtils';

/**
 * UNIX join path with true-case-path
 * @description normalize path and make drive letter uppercase
 * @param str
 * @returns Unix Style Path
 */
export function normalizePath(...str: string[]) {
  const join = path.join(...str);
  if (fs.existsSync(join)) {
    const casePath = trueCasePathSync(join);
    return fixDriveLetter(casePath);
  } else {
    return fixDriveLetter(join);
  }
}

/**
 * UNIX join path with true-case-path
 * @description normalize path and make drive letter uppercase
 * @param str
 * @returns Unix Style Path
 */
export function normalizePathUnix(...str: string[]) {
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

export default normalizePath;
