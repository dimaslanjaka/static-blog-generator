"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcodeNow = exports.now = void 0;
const _config_1 = require("../types/_config");
/**
 * Current date time
 * @return string ex> '2012-11-04 14:55:45'
 */
function now() {
    return (new Date()
        //.toISOString()
        .toLocaleString('en-US', {
        timeZone: (0, _config_1.getConfig)().timezone || 'UTC'
    })
        .replace(/T/, ' ') // replace T with a space
        .replace(/\..+/, '')); // delete the dot and everything after
}
exports.now = now;
/**
 * Transform `now shortcode` to current formatted time
 * ```html
 * <!-- now() -->
 * ```
 * @param file
 * @see {@link now}
 */
function shortcodeNow(file, read) {
    const rex = /<!-- now\(\) -->/gm;
    const matchRegex = read.match(rex);
    if (matchRegex && matchRegex.length > 0) {
        read = read.replace(rex, () => now());
        //console.log("[shortcode now][" + file.toString().replace(process.cwd(), "") + "] done");
    }
    return read;
}
exports.shortcodeNow = shortcodeNow;
exports.default = shortcodeNow;
//# sourceMappingURL=time.js.map