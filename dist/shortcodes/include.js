"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShortCodeInclude = void 0;
const chalk_1 = __importDefault(require("chalk"));
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
 * @param sourceFile
 * @param bodyString
 * @returns
 */
function parseShortCodeInclude(sourceFile, bodyString) {
    const config = (0, _config_1.getConfig)();
    const { verbose } = config.generator;
    const regex = /<!--\s+?include\s+?(.+?)\s+?-->/gim;
    let modified = false;
    let execs = Array.from(bodyString.matchAll(regex));
    while (execs.length > 0) {
        for (let i = 0; i < execs.length; i++) {
            const match = execs.shift();
            const htmlTag = match[0];
            const includefile = match[1];
            const dirs = {
                directFile: (0, upath_1.join)((0, upath_1.dirname)(sourceFile.toString()), includefile),
                //cwdFile: join(cwd(), includefile),
                rootFile: (0, upath_1.join)(root, includefile)
            };
            dirs.assetFolder = (0, upath_1.join)(sourceFile.replace(/.md$/, ''), includefile);
            for (const key in dirs) {
                if (Object.prototype.hasOwnProperty.call(dirs, key)) {
                    const filepath = dirs[key];
                    if ((0, fs_1.existsSync)(filepath)) {
                        if (verbose) {
                            console.log(logname + chalk_1.default.greenBright(`[${key}]`), sourceFile);
                        }
                        const read = (0, fs_1.readFileSync)(filepath).toString();
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
exports.parseShortCodeInclude = parseShortCodeInclude;
exports.default = parseShortCodeInclude;
//# sourceMappingURL=include.js.map