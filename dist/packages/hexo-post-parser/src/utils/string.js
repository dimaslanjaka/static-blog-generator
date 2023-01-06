"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countWords = exports.removeDoubleSlashes = void 0;
var utils_1 = require("../gulp/utils");
function removeDoubleSlashes(str) {
    if ((0, utils_1.isValidHttpUrl)(str))
        return str.replace(/([^:]\/)\/+/g, '$1');
    return str.replace(/\/+/g, '/');
}
exports.removeDoubleSlashes = removeDoubleSlashes;
function countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi, '');
    str = str.replace(/[ ]{2,}/gi, ' ');
    str = str.replace(/\n /, '\n');
    return str.split(' ').length;
}
exports.countWords = countWords;
