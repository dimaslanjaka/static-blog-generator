"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trycatchnoop = exports.noop = void 0;
function noop() {
    var _args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _args[_i] = arguments[_i];
    }
    return;
}
exports.noop = noop;
exports.default = noop;
function trycatchnoop(fn) {
    try {
        if (typeof fn.catch === 'function')
            return fn.catch(noop);
        if (typeof fn === 'function')
            fn();
    }
    catch (_a) {
    }
}
exports.trycatchnoop = trycatchnoop;
