/* eslint-disable no-useless-escape */
import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { dirname, join, toUnix } from 'upath';
import { getConfig } from '../types/_config';

const root = toUnix(process.cwd());
const logname = chalk.blue('[script]');

/**
 * Parse shortcode script
 * ```html
 * <!-- script /path/file.js -->
 * ```
 * @param file markdown file
 * @param str content to replace
 * @returns
 */
export function shortcodeScript(file: string, str: string) {
  const config = getConfig();
  const { verbose } = config.generator;
  const log = [logname];
  const regex = /<!--\s+?script\s+?(.+?)\s+?-->/gim;
  const execs = Array.from(str.matchAll(regex));
  execs.forEach((m) => {
    const htmlTag = m[0];
    const includefile = m[1];
    const dirs = {
      directFile: join(dirname(file.toString()), includefile),
      //cwdFile: join(cwd(), includefile),
      rootFile: join(root, includefile)
    };
    for (const key in dirs) {
      if (Object.prototype.hasOwnProperty.call(dirs, key)) {
        const filepath = dirs[key];
        if (existsSync(filepath)) {
          log[0] += chalk.greenBright(`[${key}]`);
          if (verbose) console.log(...log, file);
          const read = readFileSync(filepath, 'utf-8');
          str = str.replace(htmlTag, () => `<script>${read}</script>`);
          //console.log('match tag', str.match(new RegExp(htmlTag, 'm'))[0]);
          //write(tmp('shortcode', 'script.txt'), mod).then(console.log);
          break;
        }
      }
    }
  });
  return str;
}
