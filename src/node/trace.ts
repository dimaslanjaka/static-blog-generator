import color from './color';
import { PATH_SEPARATOR } from './filemanager';

/**
 * Dump caller function lines, path
 * @param n
 * @returns
 */
export function dumpCaller(n?: number) {
  const e = new Error().stack
    .split(/\sat/gm)
    .map((s) => {
      if (s.includes('node_modules')) s = color['Red Orange']('[lib]') + s;
      return s.trim();
    })
    .filter((s) => s.includes(PATH_SEPARATOR) && s.trim().length > 0);
  // remove this function trace
  e.shift();
  if (typeof n == 'number') return e[n];
  return e;
}
