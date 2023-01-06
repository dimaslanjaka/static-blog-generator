"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueStringArray = exports.uniqueArray = void 0;
function uniqueArray(array) {
    for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
            if (array[i] === array[j]) {
                array.splice(j, 1);
            }
        }
    }
    return array;
}
exports.uniqueArray = uniqueArray;
function uniqueStringArray(arr) {
    var filter = new Map(arr
        .filter(function (s) { return typeof s === 'string'; })
        .map(function (s) {
        return [s.toLowerCase(), s];
    }));
    var values = filter.values();
    return Array.from(values).filter(function (x, i, a) {
        return a.indexOf(x) === i;
    });
}
exports.uniqueStringArray = uniqueStringArray;
exports.default = uniqueArray;
