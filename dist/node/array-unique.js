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
 * @param arr
 * @returns
 */
function uniqueStringArray(arr) {
    const filter = new Map(arr.map((s) => [s.toLowerCase(), s]));
    return [...filter.values()];
}
exports.uniqueStringArray = uniqueStringArray;
exports.default = uniqueArray;
//# sourceMappingURL=array-unique.js.map