import { trueCasePathSync } from 'true-case-path';
import path from 'upath';

/**
 * normalize path and make drive letter uppercase
 * @param str
 * @returns Unix Style Path
 */
export function normalizePath(...str: string[]) {
  const join = path.join(...str);
  const casePath = trueCasePathSync(join);
  return path.toUnix(casePath);
}
export default normalizePath;
