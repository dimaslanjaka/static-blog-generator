import { deepmerge } from 'deepmerge-ts';
import { PATH_SEPARATOR } from './filemanager';

interface dumpCallerOpt {
  lib: boolean;
}

/**
 * Dump caller function lines, path
 * @param n
 * @returns
 */
export function dumpCaller(n: number): string;
export function dumpCaller(n?: number, opt?: Partial<dumpCallerOpt>): string[];
export function dumpCaller(n?: number, opt?: Partial<dumpCallerOpt>) {
  if (typeof opt == 'object') opt = deepmerge({ lib: true }, opt);
  const e = new Error().stack
    .split(/\sat/gm)
    .map((s) => {
      if (s.includes('node_modules')) {
        if (opt.lib) {
          s = '[lib] ' + s;
        } else {
          return null;
        }
      }
      // remove this function trace
      if (s.includes('dumpCaller')) return null;

      const re = /eval.*['"]([\w\W]*)['"]:([\d]*):([\d]*)/gm;
      if (re.test(s)) {
        const m = s.match(re);
        s = `[ejs] eval (${m[1]}:${m[2]}:${m[3]})`;
      }
      return s.trim().replace(/\s+/, ' ');
    })
    .filter(
      (s) => typeof s == 'string' && s.includes(PATH_SEPARATOR) && s.length > 0
    );
  if (typeof n == 'number') return e[n];
  return e;
}
