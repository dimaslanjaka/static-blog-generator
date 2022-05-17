"use strict";
/**
 * clean white spaces
 * @param s
 * @returns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceArr = exports.cleanString = exports.cleanWhiteSpace = void 0;
function cleanWhiteSpace(text) {
    if (typeof text == 'string')
        return text.replace(/\s+/gm, ' ');
    return text;
}
exports.cleanWhiteSpace = cleanWhiteSpace;
/**
 * clean string with exception char
 * @param text
 * @returns
 */
function cleanString(text, exception = '.,-_ ') {
    if (typeof text == 'string')
        return text.replace(new RegExp('[^a-zA-Z0-9' + exception + ']', 'gm'), '');
    return text;
}
exports.cleanString = cleanString;
/**
 * Replace string by array pattern
 * @param array
 * @param replacement
 */
function replaceArr(str, array, replacement) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let ori = str;
    array.map((str) => {
        ori = ori.replace(str, replacement);
    });
    return ori;
}
exports.replaceArr = replaceArr;
//# sourceMappingURL=utils.js.map