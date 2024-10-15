'use strict';

var fs = require('fs-extra');
var path = require('path');

/**
 * copy file/folder recursively
 * @param src
 * @param dest
 * @param options
 * @returns
 */
function copyPath(src, dest, options) {
    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    return fs.copy(src, dest, Object.assign({ overwrite: true, dereference: true, errorOnExist: false }, options || {}));
}

exports.copyPath = copyPath;
