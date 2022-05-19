"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueArray = void 0;
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
exports.default = uniqueArray;
//# sourceMappingURL=array-unique.js.map