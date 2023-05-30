import fs from 'fs-extra';
import path from 'upath';
import { trueCasePathSync } from './case-path';

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
    return path.toUnix(casePath);
  } else {
    return join;
  }
}

/**
 * UNIX join path with auto create dirname when not exists
 * @param path
 * @returns
 */
export function joinSolve(...paths: string[]) {
  const merge = normalizePath(...paths);
  if (!fs.existsSync(path.dirname(merge))) {
    fs.mkdirSync(path.dirname(merge), { recursive: true });
  }
  return merge;
}

export default normalizePath;
