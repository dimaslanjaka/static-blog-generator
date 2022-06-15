"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_split_chunks = exports.array_move_index = exports.array_move = exports.array_shuffle = exports.shuffle = exports.array_rand = exports.array_unique = exports.arrayAddAll = exports.uniqueStringArray = exports.getLastItem = exports.removeEmpties = void 0;
/**
 * remove empties from array
 * @param array
 * @param keep keep item such as `[null, 0, '']`
 * @returns
 * @see {@link https://www.typescriptlang.org/play?downlevelIteration=true&target=3&jsx=0&module=1#code/MYewdgzgLgBAhgJwXAnjAvDA2gRgDQwBMBAzAQK5gAmApgGYCWYNVBADAWOQDbcEBE-AVSr8AugG4AsAChQkENxoA6YEsQAKAJTS54CIpXcQAcw38A1jRoAHeLwBc-HbPkGly42YQ0AtiAA3GgBRXxsoBhoIDURkFAIsLl52AXEtFz0FDy9zK1sYAC8aBBAYDTYtJwy3Q09TDR9-INDwyOjY1AS2MXTdGuz6y2s7JO4qvv1anMbAkLCIqJikTuxRnurJgbMh-L9wtGgEJhNx102jepnm+baluITBdYmsi+2qcFg8uzgwFCgAC2Op0y7leDT8sxaC3ayxQvVksgA9AAqZGyGDImBXGgwPbQmB0Eq+eCw9GYgACNkQcGJHRQZJglOpxK+MFZDCgfhgEHIwH+8Agqx4fBgHBgAHJxWIGeSfFByAhIDKaAAPGk2JRksmI2R0SjACLgLEQ66tKIAHgAKriVZzqIKfigsGIAHwadEkuIOGCWvAer7ejSjGAAHxgXF8ACNiqHuVAjmATFpnRhsNKZFoYABvD1KWDMADuAEFYam6cpGNxOQgNBoOX5M+gXTAoCgbDQQHQYPXiQBCdCYfiUWiMZiiDIwGBuT7DQWYL7KXxwGy1nuN5sAZXjxzrnN88Jkk4YXY0va+EGUTDU5Fo0X4o2cWg9k8LJbiqdfsIrDCrxVXe-Xbs9xgftMFGCcYERRF+jBcUoBwcVOBoYtYQg48yjPWdLzAa9b3MNhH2zZ9w2Qt9UA-Uiv0rat-wbDBmxzQ9J2Y9CNFbdtOyArkBxge9yCjYpnGNeVFS4vseLYXRmOYuUFTAFsEHIGgpOYgBfCDVI9KCYLqMw4MIRCSJQuI0JPTDbAvK9uBvRZBHSIimJfSj3zA5zUG-X8a13Oimwc6SjxPdiOy7HsMEHQ5jiE2TRJ7ZRt18bRPBoRMARgZtJOIydovk+MlJUyd1JUzSmOyoyyLQOBBUtXRiqAA}
 * @example
 */
function removeEmpties(array, keep) {
    if (keep === void 0) { keep = []; }
    var newArray = array.filter(function (item) { return typeof item !== 'undefined'; });
    var keeps = keep.map(function (item) { return String(item); });
    if (!keeps.includes('null'))
        newArray = newArray.filter(function (item) { return item !== null; });
    //console.log('t1', newArray);
    if (!keeps.includes('0')) {
        newArray = newArray.filter(function (item) {
            if (typeof item == 'number')
                return item !== 0;
            return true;
        });
    }
    //console.log('t2', newArray);
    if (!keeps.includes('')) {
        newArray = newArray.filter(function (item) {
            if (typeof item == 'string')
                return item.trim().length > 0;
            return true;
        });
    }
    return newArray;
}
exports.removeEmpties = removeEmpties;
/**
 * get item from last index array
 * @param arr
 * @param lastIndex index from last
 * @see {@link https://www.typescriptlang.org/play?downlevelIteration=true&target=3&jsx=0&module=1#code/MYewdgzgLgBAhgJwXAnjAvDA2gRgDQwBMBAzAQK5gAmApgGYCWYNVBADAWOQDbcEBE-AVSr8AugG4AsAChQkENxoA6YEsQAKAJTS54CIpXcQAcw0maUADJxoASSg0AthsTIUpLTtmyA9ACp-WRh-GAtYBkcnGDoEEGjuWwjqGgAPeCRUYNCAAQAHRDhot2yYfMKEpLsU9KZadNj4mEToUpyES3IESGzfWTS8kARYOkpgKAZwMMsbeyiAHgAVGDTHagh4MBQsMQA+VyQALhhFghaoavqMGBwtGABvYJgOqC6wDIQsN2UlMBMoAAWMAAtM0qjVJLIAL6yIA}
 * @returns
 */
function getLastItem(arr, lastIndex) {
    if (lastIndex === void 0) { lastIndex = 1; }
    return arr[arr.length - lastIndex];
}
exports.getLastItem = getLastItem;
/**
 * Unique string array case insensitive but keep one case sensitive result
 * @see {@link https://stackoverflow.com/a/48731445/6404439}
 * @example
 * console.log(uniqueStringArray(['James', 'james', 'bob', 'JaMeS', 'Bob'])); // ["JaMeS", "Bob"]
 */
var uniqueStringArray = function (arr) {
    var filter = new Map(arr.map(function (s) { return [s.toLowerCase(), s]; }));
    return __spreadArray([], __read(filter.values()), false);
};
exports.uniqueStringArray = uniqueStringArray;
/**
 * @summary Add another array
 * @description Add another array to current array
 * @param self
 * @param otherArrays
 * @example
 * var a = [0,1];
 * var b = ['a','b'];
 * arrayAddAll(b, a); // concat a to b
 * console.log(b); // ['a','b',0,1]
 */
var arrayAddAll = function (self) {
    var otherArrays = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        otherArrays[_i - 1] = arguments[_i];
    }
    otherArrays.forEach(function (array) {
        array.forEach(function (item) {
            self.push(item);
        });
    });
    return self;
};
exports.arrayAddAll = arrayAddAll;
/**
 * Array unique
 * @param {Array<any>} arrays
 */
function array_unique(arrays) {
    return arrays.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
    });
}
exports.array_unique = array_unique;
/**
 * pick random from array
 * @param {Array<any>} arrays
 * @param {boolean} unique Unique the arrays
 */
function array_rand(arrays, unique) {
    if (unique) {
        arrays = array_unique(arrays);
    }
    var index = Math.floor(Math.random() * arrays.length);
    return {
        index: index,
        value: arrays[index]
    };
}
exports.array_rand = array_rand;
/**
 * PHP shuffle array equivalent
 * @param array
 * @example
 * var arr = [2, 11, 37, 42];
 * shuffle(arr);
 * console.log(arr); //return random
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
exports.shuffle = shuffle;
/**
 * @see {@link shuffle}
 */
exports.array_shuffle = shuffle;
/**
 * Move item to another index
 * @see {@link https://stackoverflow.com/a/70618791/6404439}
 * @param arr
 * @param from
 * @param to
 * @returns
 */
var array_move = function (arr, from, to) {
    var itemRemoved = arr.splice(from, 1); // splice() returns the remove element as an array
    arr.splice(to, 0, itemRemoved[0]); // Insert itemRemoved into the target index
    return arr;
};
exports.array_move = array_move;
/**
 * @see {@link array_move}
 */
exports.array_move_index = exports.array_move;
/**
 * split array to chunks
 * @param sourceArray
 * @param chunkSize
 * @see {@link https://stackoverflow.com/a/71483760/6404439}
 * @returns
 * @example
let ar1 = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
];
// split array by 4
console.log("Split in chunks with 4 size", splitChunks(ar1, 4)); // [[1,2,3,4], [5,6,7,8]...]
 */
function array_split_chunks(sourceArray, chunkSize) {
    if (chunkSize <= 0)
        throw 'chunkSize must be greater than 0';
    var result = [];
    for (var i = 0; i < sourceArray.length; i += chunkSize) {
        result[i / chunkSize] = sourceArray.slice(i, i + chunkSize);
    }
    return result;
}
exports.array_split_chunks = array_split_chunks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXktdXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9hcnJheS11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLGFBQWEsQ0FDM0IsS0FBUSxFQUNSLElBQXFDO0lBQXJDLHFCQUFBLEVBQUEsU0FBcUM7SUFFckMsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLE9BQU8sSUFBSSxLQUFLLFdBQVcsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO0lBQ25FLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQVosQ0FBWSxDQUFDLENBQUM7SUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ3pCLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxLQUFLLElBQUksRUFBYixDQUFhLENBQUMsQ0FBQztJQUN0RCw4QkFBOEI7SUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEIsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJO1lBQzlCLElBQUksT0FBTyxJQUFJLElBQUksUUFBUTtnQkFBRSxPQUFPLElBQUksS0FBSyxDQUFDLENBQUM7WUFDL0MsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztLQUNKO0lBQ0QsOEJBQThCO0lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ3ZCLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSTtZQUM5QixJ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