import fs__default from 'fs-extra';
import { platform } from 'os';
import path__default from 'path';
import path__default$1 from 'upath';
import { promisify } from 'util';

const readdir = promisify(fs__default.readdir);
const isWindows = platform() === 'win32';
const delimiter = isWindows ? '\\' : '/';
function trueCasePathNew(opt) {
    const defaults = { sync: false };
    const trueCase = _trueCasePath(Object.assign(defaults, opt || {}));
    return (filePath, basePath, cbOpt) => {
        if (filePath.length > 3) {
            let result;
            let bPath = undefined;
            let callbackOpt = Object.assign({ unix: false }, cbOpt || {});
            if (typeof basePath === 'string') {
                bPath = basePath;
            }
            else if (typeof basePath === 'object') {
                callbackOpt = Object.assign({ unix: false }, basePath || {});
            }
            // Join basePath if provided
            let fPath = filePath;
            if (typeof bPath === 'string')
                fPath = path__default.join(bPath, filePath);
            // Normalize the path before any checks
            fPath = path__default.normalize(fPath);
            // Check if the file exists
            if (fs__default.existsSync(fPath)) {
                result = trueCase(filePath, bPath);
            }
            else {
                // Only capitalize the drive letter, don't touch the rest of the path
                result = fPath.replace(/^([a-zA-Z]):/, (match, driveLetter) => {
                    return driveLetter.toUpperCase() + ':';
                });
            }
            // Handle Unix conversion if requested
            if (callbackOpt?.unix) {
                return path__default$1.toUnix(result);
            }
            else {
                return result;
            }
        }
        else {
            // Error handling for invalid paths
            if (typeof basePath === 'string') {
                if (opt?.debug)
                    console.error('Failed to convert case-path of', { basePath, filePath });
                return path__default.join(basePath, filePath);
            }
            else {
                if (opt?.debug)
                    console.error('Failed to convert case-path of', { filePath });
                return filePath;
            }
        }
    };
}
const trueCasePathSync = trueCasePathNew({ sync: true });
const trueCasePath = trueCasePathNew({ sync: false });
function getRelevantFilePathSegments(filePath) {
    return filePath.split(delimiter).filter((s) => s !== '');
}
function escapeString(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function matchCaseInsensitive(fileOrDirectory, directoryContents, filePath) {
    const caseInsensitiveRegex = new RegExp(`^${escapeString(fileOrDirectory)}$`, 'i');
    for (const file of directoryContents) {
        if (caseInsensitiveRegex.test(file))
            return file;
    }
    throw new Error(`[true-case-path]: Called with ${filePath}, but no matching file exists`);
}
function _trueCasePath({ sync }) {
    return (filePath, basePath) => {
        if (!fs__default.existsSync(filePath))
            return basePath ? path__default.join(basePath, filePath) : filePath;
        if (basePath) {
            if (!path__default.isAbsolute(basePath)) {
                throw new Error(`[true-case-path]: basePath argument must be absolute. Received "${basePath}"`);
            }
            basePath = path__default.normalize(basePath);
        }
        filePath = path__default.normalize(filePath);
        const segments = getRelevantFilePathSegments(filePath);
        if (path__default.isAbsolute(filePath)) {
            if (basePath) {
                throw new Error('[true-case-path]: filePath must be relative when used with basePath');
            }
            basePath = isWindows
                ? segments.shift()?.toUpperCase() // drive letter
                : '';
        }
        else if (!basePath) {
            basePath = process.cwd();
        }
        return sync ? iterateSync(basePath, filePath, segments) : iterateAsync(basePath, filePath, segments);
    };
}
function iterateSync(basePath, filePath, segments) {
    return segments.reduce((realPath, fileOrDirectory) => realPath + delimiter + matchCaseInsensitive(fileOrDirectory, fs__default.readdirSync(realPath + delimiter), filePath), basePath);
}
async function iterateAsync(basePath, filePath, segments) {
    return await segments.reduce(async (realPathPromise, fileOrDirectory) => (await realPathPromise) +
        delimiter +
        matchCaseInsensitive(fileOrDirectory, await readdir((await realPathPromise) + delimiter), filePath), basePath);
}

export { isWindows, trueCasePath, trueCasePathSync };
