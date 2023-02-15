import fs from 'fs-extra';
import { trueCasePathSync } from 'true-case-path';
import path from 'upath';

/**
 * UNIX join path with true-case-path
 * @description normalize path and make drive letter uppercase
 * @param str
 * @returns Unix Style Path
 */
export function normalizePath(...str: string[]) {
  const join = path.join(...str);
  const casePath = trueCasePathSync(join);
  return path.toUnix(casePath);
}

/**
 * UNIX join path with auto create dirname when not exists
 * @param path
 * @returns
 */
export function joinSolve(...paths: string[]) {
  const merge = normalizePath(...paths);
  if (!fs.existsSync(path.dirname(merge))) fs.mkdirSync(path.dirname(merge), { recursive: true });
  return merge;
}

export default normalizePath;
