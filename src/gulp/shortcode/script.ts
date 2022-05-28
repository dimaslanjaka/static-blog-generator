/* eslint-disable no-useless-escape */
import chalk from 'chalk';
import { existsSync } from 'fs';
import { cwd, dirname, join, read } from '../../node/filemanager';
import { root } from '../../types/_config';

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
  const log = [logname];
  const regex = /<!--\s+?script\s+?(.+?)\s+?-->/gim;
  const execs = Array.from(str.matchAll(regex));
  execs.forEach((m) => {
    const htmlTag = m[0];
    const includefile = m[1];
    const dirs = {
      directFile: join(dirname(file.toString()), includefile),
      cwdFile: join(cwd(), includefile),
      rootFile: join(root, includefile)
    };
    for (const key in dirs) {
      if (Object.prototype.hasOwnProperty.call(dirs, key)) {
        const filepath = dirs[key];
        if (existsSync(filepath)) {
          log[0] += chalk.greenBright(`[${key}]`);
          console.log(...log, file);
          const contents = read(filepath, 'utf-8');
          str = str.replace(htmlTag, () => `<script>${contents}</script>`);
          //console.log('match tag', str.match(new RegExp(htmlTag, 'm'))[0]);
          //write(tmp('shortcode', 'script.txt'), mod).then(console.log);
          break;
        }
      }
    }
  });
  return str;
}
