"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueStringArray = exports.uniqueArray = void 0;
function uniqueArray(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] === array[j]) {
                array.splice(j, 1);
            }
        }
    }
    return array;
}
exports.uniqueArray = uniqueArray;
/**
 * Unique Array Of Strings
 * @description Lowercase all string and filter duplicated from them
 * @param arr
 * @returns
 */
function uniqueStringArray(arr) {
    const filter = new Map(arr
        .filter((s) => typeof s === 'string')
        .map((s) => {
        return [s.toLowerCase(), s];
    }));
    const values = filter.values();
    /*
    return [...filter.values()];*/
    return Array.from(values).filter(function (x, i, a) {
        return a.indexOf(x) === i;
    });
}
exports.uniqueStringArray = uniqueStringArray;
exports.default = uniqueArray;
//# sourceMappingURL=array-unique.js.map