import fs__default from 'fs-extra';
import path__default from 'path';
import path__default$1 from 'upath';
import { trueCasePathSync } from './case-path.mjs';

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
    const join = path__default.join(...str);
    if (fs__default.existsSync(join)) {
        const casePath = trueCasePathSync(join);
        return fixDriveLetter(casePath);
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
    const join = path__default$1.join(...str);
    if (fs__default.existsSync(join)) {
        const casePath = trueCasePathSync(join);
        return fixDriveLetter(path__default$1.toUnix(casePath));
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
    if (!fs__default.existsSync(path__default$1.dirname(merge))) {
        fs__default.mkdirSync(path__default$1.dirname(merge), { recursive: true });
    }
    return merge;
}

export { normalizePath as default, fixDriveLetter, joinSolve, normalizePath, normalizePathUnix, removeCwd };
