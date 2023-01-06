"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceArr = exports.cleanString = exports.cleanWhiteSpace = void 0;
function cleanWhiteSpace(text) {
    if (typeof text == 'string')
        return text.replace(/\s+/gm, ' ');
    return text;
}
exports.cleanWhiteSpace = cleanWhiteSpace;
function cleanString(text, exception) {
    if (exception === void 0) { exception = '.,-_ '; }
    if (typeof text == 'string')
        return text.replace(new RegExp('[^a-zA-Z0-9' + exception + ']', 'gm'), '');
    return text;
}
exports.cleanString = cleanString;
function replaceArr(str, array, replacement) {
    var ori = str;
    array.forEach(function (str, i) {
        if (typeof replacement == 'string') {
            ori = ori.replace(str, replacement);
        }
        else {
            ori = ori.replace(str, replacement[i]);
        }
    });
    return ori;
}
exports.replaceArr = replaceArr;
