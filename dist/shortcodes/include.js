"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShortCodeInclude = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = require("fs");
const upath_1 = require("upath");
const root = (0, upath_1.toUnix)(process.cwd());
const logname = chalk_1.default.blue('[include]');
/**
 * Process `shortcode include` to included in file, shortcode below:
 * ```html
 * <!-- include file.ext -->
 * ```
 * @param file
 * @param str
 * @returns
 */
function parseShortCodeInclude(file, str) {
    const regex = /<!--\s+?include\s+?(.+?)\s+?-->/gim;
    const execs = Array.from(str.matchAll(regex));
    if (execs.length) {
        execs.forEach((m) => {
            const htmlTag = m[0];
            const includefile = m[1];
            const dirs = {
                directFile: (0, upath_1.join)((0, upath_1.dirname)(file.toString()), includefile),
                //cwdFile: join(cwd(), includefile),
                rootFile: (0, upath_1.join)(root, includefile)
            };
            for (const key in dirs) {
                if (Object.prototype.hasOwnProperty.call(dirs, key)) {
                    const filepath = dirs[key];
                    if ((0, fs_1.existsSync)(filepath)) {
                        console.log(logname + chalk_1.default.greenBright(`[${key}]`), file);
                        const read = (0, fs_1.readFileSync)(filepath).toString();
                        str = str.replace(htmlTag, () => read);
                        break;
                    }
                }
            }
        });
    }
    return str;
    /*
    let m: RegExpExecArray;
    const found = false;
    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
  
      const allmatch = m[0];
      const bracketmatch = m[1];
  
  
      /*if (existsSync(directFile)) {
        // search from file directory
        console.info(logname + chalk.greenBright('[direct]'), directFile);
        const directRead = readFileSync(directFile).toString();
        str = str.replace(allmatch, directRead);
        found = true;
      } else if (existsSync(cwdFile)) {
        // search from workspace directory
        console.log(logname + chalk.greenBright('[root]'), cwdFile);
        console.info(`${logname} found from direct ${cwdFile}`);
        const rootRead = readFileSync(cwdFile).toString();
        str = str.replace(allmatch, rootRead);
        found = true;
      } else {
        console.error(chalk.redBright('[include][error]'), "couldn't find any file from root", cwdFile);
        console.error(chalk.redBright('[include][error]'), "couldn't find any file from direct", directFile);
        console.log(chalk.redBright('[include][error]'), chalk.magenta('1'), dirname(file.toString()));
        console.log(chalk.redBright('[include][error]'), chalk.magenta('2'), bracketmatch);
        console.log(chalk.redBright('[include][error]'), chalk.magenta('3'), join(dirname(file), bracketmatch));
      }
    }
    // match shortcode and found otherwise repeat
    if (found && str.match(regex)) return parseShortCodeInclude(file, str);
    */
}
exports.parseShortCodeInclude = parseShortCodeInclude;
exports.default = parseShortCodeInclude;
//# sourceMappingURL=include.js.map