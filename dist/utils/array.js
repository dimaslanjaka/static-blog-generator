"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_remove_empty = exports.array_unique = exports.array_random = void 0;
function array_random(items) {
    return items[Math.floor(Math.random() * items.length)];
}
exports.array_random = array_random;
function array_unique(arr, field) {
    if (Array.isArray(arr)) {
        if (typeof field !== 'string') {
            arr = arr.filter(function (x, i, a) {
                return a.indexOf(x) === i;
            });
        }
        else {
            arr = arr.filter(function (a, i) { return arr.findIndex(function (s) { return a[field] === s[field]; }) === i; });
        }
        return arr.filter(function (item) {
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
exports.array_unique = array_unique;
function array_remove_empty(arr) {
    return arr.filter(function (target) {
        if (typeof target === 'string')
            return target.trim().length > 0;
        if (Array.isArray(target))
            return target.length > 0;
        if (typeof target === 'object')
            return Object.keys(target).length > 0;
        return true;
    });
}
exports.array_remove_empty = array_remove_empty;
