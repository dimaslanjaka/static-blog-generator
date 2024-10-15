import fs__default from 'fs-extra';
import path__default from 'path';

/**
 * copy file/folder recursively
 * @param src
 * @param dest
 * @param options
 * @returns
 */
function copyPath(src, dest, options) {
    if (!fs__default.existsSync(path__default.dirname(dest))) {
        fs__default.mkdirSync(path__default.dirname(dest), { recursive: true });
    }
    return fs__default.copy(src, dest, Object.assign({ overwrite: true, dereference: true, errorOnExist: false }, options || {}));
}

export { copyPath };
