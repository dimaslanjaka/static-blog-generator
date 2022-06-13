"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShortCodeInclude = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = require("fs");
const upath_1 = require("upath");
const _config_1 = require("../types/_config");
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
                        if (_config_1.verbose)
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
}
exports.parseShortCodeInclude = parseShortCodeInclude;
exports.default = parseShortCodeInclude;
//# sourceMappingURL=include.js.map