import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { dirname, join, toUnix } from 'upath';
import { verbose } from '../types/_config';

const root = toUnix(process.cwd());
const logname = chalk.blue('[include]');

/**
 * Process `shortcode include` to included in file, shortcode below:
 * ```html
 * <!-- include file.ext -->
 * ```
 * @param sourceFile
 * @param bodyString
 * @returns
 */
export function parseShortCodeInclude(sourceFile: string, bodyString: string) {
  const regex = /<!--\s+?include\s+?(.+?)\s+?-->/gim;
  let modified = false;
  let execs = Array.from(bodyString.matchAll(regex));
  while (execs.length > 0) {
    for (let i = 0; i < execs.length; i++) {
      const match = execs.shift();

      const htmlTag = match[0];
      const includefile = match[1];
      const dirs: Record<string, string> = {
        directFile: join(dirname(sourceFile.toString()), includefile),
        //cwdFile: join(cwd(), includefile),
        rootFile: join(root, includefile)
      };
      dirs.assetFolder = join(sourceFile.replace(/.md$/, ''), includefile);

      for (const key in dirs) {
        if (Object.prototype.hasOwnProperty.call(dirs, key)) {
          const filepath = dirs[key];
          if (existsSync(filepath)) {
            if (verbose) {
              console.log(logname + chalk.greenBright(`[${key}]`), sourceFile);
            }
            const read = readFileSync(filepath).toString();
            bodyString = bodyString.replace(htmlTag, () => read);
            execs = Array.from(bodyString.matchAll(regex));
            modified = true;
            break;
          }
        }
      }
    }
  }
  // @todo include nested shortcodes when modified occurs
  if (regex.test(bodyString) && modified) {
    return parseShortCodeInclude(sourceFile, bodyString);
  }
  return bodyString;
}
export default parseShortCodeInclude;
