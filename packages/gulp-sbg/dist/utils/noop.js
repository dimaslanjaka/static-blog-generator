"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trycatchnoop = void 0;
/**
 * no operations
 * @param _args
 * @returns
 */
function noop() {
    var _args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _args[_i] = arguments[_i];
    }
    return;
}
exports.default = noop;
/**
 * try catch nooperation
 * @param fn
 * @returns
 */
function trycatchnoop(fn) {
    try {
        if (typeof fn.catch === 'function')
            return fn.catch(noop);
        if (typeof fn === 'function')
            fn();
    }
    catch (_a) {
        //
    }
}
exports.trycatchnoop = trycatchnoop;
