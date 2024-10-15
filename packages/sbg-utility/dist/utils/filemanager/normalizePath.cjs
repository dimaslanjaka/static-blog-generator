'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var path = require('path');
var path$1 = require('upath');
var casePath = require('./case-path.cjs');

function fixDriveLetter(filePath) {
    // Handle Windows-style paths with lowercase drive letters
    if (/^[a-z]:/.test(filePath)) {
        // Ensure first letter is uppercase
        return filePath.charAt(0).toUpperCase() + filePath.slice(1);
    }
    return filePath;
}
/**
 * UNIX join path with true-case-path
 * @description normalize path and make drive letter uppercase
 * @param str
 * @returns Unix Style Path
 */
function normalizePath(...str) {
    const join = path.join(...str);
    if (fs.existsSync(join)) {
        const casePath$1 = casePath.trueCasePathSync(join);
        return fixDriveLetter(casePath$1);
    }
    else {
        return fixDriveLetter(join);
    }
}
/**
 * UNIX join path with true-case-path
 * @description normalize path and make drive letter uppercase
 * @param str
 * @returns Unix Style Path
 */
function normalizePathUnix(...str) {
    const join = path$1.join(...str);
    if (fs.existsSync(join)) {
        const casePath$1 = casePath.trueCasePathSync(join);
        return fixDriveLetter(path$1.toUnix(casePath$1));
    }
    else {
        return fixDriveLetter(join);
    }
}
/**
 * remove base path
 * @param target path to remove
 * @param toRemove cwd
 */
function removeCwd(target, toRemove) {
    return normalizePath(target).replace(toRemove, '');
}
/**
 * UNIX join path with auto create dirname when not exists
 * @param path
 * @returns
 */
function joinSolve(...paths) {
    const merge = normalizePath(...paths);
    if (!fs.existsSync(path$1.dirname(merge))) {
        fs.mkdirSync(path$1.dirname(merge), { recursive: true });
    }
    return merge;
}

exports.default = normalizePath;
exports.fixDriveLetter = fixDriveLetter;
exports.joinSolve = joinSolve;
exports.normalizePath = normalizePath;
exports.normalizePathUnix = normalizePathUnix;
exports.removeCwd = removeCwd;
