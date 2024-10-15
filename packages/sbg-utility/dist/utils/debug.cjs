'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var debuglib = require('debug');

/**
 * debug helper
 * @param name
 * @returns
 */
function debug(name) {
    return debuglib(name);
}
/**
 * debug with default name `sbg`
 * @returns
 */
function sbgDebug() {
    return debuglib('sbg');
}

exports.debug = debug;
exports.default = debug;
exports.sbgDebug = sbgDebug;
