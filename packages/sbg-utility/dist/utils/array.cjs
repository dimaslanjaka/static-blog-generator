'use strict';

/**
 * pick random items from array
 * @param items
 * @returns
 */
function array_random(items) {
    return items[Math.floor(Math.random() * items.length)];
}
/**
 * unique array
 * * array of string,number
 * * array of object by object key
 * @param arr
 * @param field key name (for array of object)
 * @returns
 *
 * @example
 * arrayOfObjUniq({p:'x',n:'x'},{p:'23',n:'x'},{p:'x',n:'5g'}, 'p'); // [{p:'x',n:'x'},{p:'23',n:'x'}]
 *
 * @link https://stackoverflow.com/a/67322087/6404439
 */
function array_unique(arr, field) {
    if (Array.isArray(arr)) {
        if (typeof field !== 'string') {
            arr = arr.filter(function (x, i, a) {
                return a.indexOf(x) === i;
            });
        }
        else {
            arr = arr.filter((a, i) => arr.findIndex((s) => a[field] === s[field]) === i);
        }
        return arr.filter((item) => {
            if (typeof item === 'string')
                return item.trim().length > 0;
            if (Array.isArray(item))
                return item.length > 0;
            return true;
        });
    }
    else {
        throw new Error('array param must be instance of ARRAY');
    }
}
/**
 * Remove empties from array
 * @param arr
 * @returns
 */
function array_remove_empty(arr) {
    return arr.filter((target) => {
        if (typeof target === 'string')
            return target.trim().length > 0;
        if (Array.isArray(target))
            return target.length > 0;
        if (typeof target === 'object')
            return Object.keys(target).length > 0;
        return true;
    });
}
/**
 * unique array of object by object key
 * @param arr
 * @param field key name
 * @returns
 * @see {@link https://stackoverflow.com/a/67322087/6404439}
 * @example
 * const arrobj = [{p:'x',n:'x'},{p:'23',n:'x'},{p:'x',n:'5g'}],
 * arrayOfObjUniq(arrobj, 'p'); // [{p:'x',n:'x'},{p:'23',n:'x'}]
 */
function arrayOfObjUniq(arr, field) {
    //console.log(array);
    if (!Array.isArray(arr)) {
        throw new Error('array param must be instance of ARRAY');
    }
    return arr.filter((a, i) => arr.findIndex((s) => a[field] === s[field]) === i);
}
/**
 * array shuffler
 * @param items
 * @returns
 */
function array_shuffle(items) {
    return items.sort(() => Math.random() - 0.5);
}
/**
 * generate random number
 * @see {@link https://stackoverflow.com/a/65638217/6404439}
 * @param n
 * @returns
 */
const rand = (n) => 0 | (Math.random() * n);
/**
 * fast shuffle array (internal)
 * @see {@link https://stackoverflow.com/a/65638217/6404439}
 * @param t
 */
function swap(t, i, j) {
    const q = t[i];
    t[i] = t[j];
    t[j] = q;
    return t;
}
/**
 * fast shuffle array using swap method
 * @see {@link https://stackoverflow.com/a/65638217/6404439}
 * @param t
 */
function array_shuffle_swap(t) {
    let last = t.length;
    let n;
    while (last > 0) {
        n = rand(last);
        swap(t, n, --last);
    }
}
/**
 * flattern array
 * @param arr
 * @returns
 */
function array_flatten(arr, depth) {
    if (typeof depth === 'number')
        return arr.flat(depth);
    return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? array_flatten(cur) : cur), []);
}

exports.arrayOfObjUniq = arrayOfObjUniq;
exports.array_flatten = array_flatten;
exports.array_random = array_random;
exports.array_remove_empty = array_remove_empty;
exports.array_shuffle = array_shuffle;
exports.array_shuffle_swap = array_shuffle_swap;
exports.array_unique = array_unique;
exports.rand = rand;
