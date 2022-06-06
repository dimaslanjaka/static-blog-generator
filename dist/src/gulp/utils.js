"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidHttpUrl = exports.isEmpty = exports.slash = exports.loopDir = exports.determineDirname = exports.replacePath = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var upath_1 = require("upath");
var _config_1 = require("../types/_config");
var rename_1 = require("./modules/rename");
/**
 * Crossplatform path replacer
 * @param str
 * @param from
 * @param to
 * @returns
 */
function replacePath(str, from, to) {
    var normalize = function (x) { return x.replace(/\\/gim, '/'); };
    str = normalize(str);
    from = normalize(from);
    to = normalize(to);
    return str.replace(from, to);
}
exports.replacePath = replacePath;
/**
 * Determine gulp.dest ({@link GulpDest}) location
 * @param pipe
 * @see import('gulp')
 * @returns
 */
function determineDirname(pipe) {
    return pipe.pipe((0, rename_1.gulpRename)(function (file) {
        var dname = (0, upath_1.dirname)(replacePath((0, upath_1.toUnix)(file.fullpath), (0, upath_1.toUnix)(_config_1.post_source_dir), ''))
            .replace((0, upath_1.toUnix)(process.cwd()), '')
            .replace('/src-posts/', '');
        file.dirname = dname;
        //if (file.fullpath.includes('Recipes')) console.log(dname, post_public_dir, file);
    }));
}
exports.determineDirname = determineDirname;
/**
 * Loop dir recursive
 * @param destDir
 * @param debug
 */
function loopDir(destDir, debug) {
    if (debug === void 0) { debug = false; }
    if (!fs_1.default.lstatSync(destDir).isDirectory()) {
        if (debug)
            console.error(destDir + " isn't folder");
        return;
    }
    var result = [];
    var readDir = fs_1.default.readdirSync(destDir);
    if (readDir) {
        if (debug)
            console.log(readDir.length + ' files to process');
        readDir.forEach(function (file) {
            var absolute = path_1.default.join(destDir.toString(), file);
            if (fs_1.default.statSync(absolute).isDirectory()) {
                result = loopDir(absolute).concat(result);
            }
            else {
                result.push(absolute);
            }
        });
    }
    return result;
}
exports.loopDir = loopDir;
/**
 * slash alternative
 * ```bash
 * npm i slash #usually
 * ```
 * @url {@link https://github.com/sindresorhus/slash}
 * @param path
 */
function slash(path) {
    var isExtendedLengthPath = /^\\\\\?\\/.test(path);
    var hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }
    return path.replace(/\\/g, '/');
}
exports.slash = slash;
/**
 * check variable is empty, null, undefined, object/array length 0, number is 0
 * @param data
 * @returns
 */
var isEmpty = function (data) {
    if (data === null)
        return true;
    if (typeof data === 'string' && data.trim().length === 0)
        return true;
    if (typeof data === 'undefined')
        return true;
    if (typeof data === 'number') {
        if (data === 0)
            return true;
    }
    if (typeof data === 'object') {
        if (Array.isArray(data) && data.length === 0)
            return true;
        if (data.constructor === Object && Object.keys(data).length === 0)
            return true;
    }
    return false;
};
exports.isEmpty = isEmpty;
/**
 * Cached validated urls
 */
var validatedHttpUrl = {};
/**
 * Cacheable validate url is valid and http or https protocol
 * @param str
 * @returns
 */
function isValidHttpUrl(str) {
    if (typeof validatedHttpUrl[str] === 'boolean')
        return validatedHttpUrl[str];
    var url;
    try {
        url = new URL(str);
    }
    catch (_) {
        return false;
    }
    var validate = url.protocol === 'http:' || url.protocol === 'https:';
    if (validate) {
        validatedHttpUrl[str] = validate;
    }
    return validate;
}
exports.isValidHttpUrl = isValidHttpUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwQ0FBb0I7QUFFcEIsOENBQXdCO0FBQ3hCLCtCQUF3QztBQUV4Qyw0Q0FBbUQ7QUFDbkQsMkNBQThDO0FBRTlDOzs7Ozs7R0FNRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxHQUFXLEVBQUUsSUFBWSxFQUFFLEVBQVU7SUFDL0QsSUFBTSxTQUFTLEdBQUcsVUFBQyxDQUFTLElBQUssT0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQztJQUN6RCxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsRUFBRSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFORCxrQ0FNQztBQU9EOzs7OztHQUtHO0FBQ0gsU0FBZ0IsZ0JBQWdCLENBQUMsSUFBNEI7SUFDM0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUNkLElBQUEsbUJBQVUsRUFBQyxVQUFDLElBQUk7UUFDZCxJQUFNLEtBQUssR0FBRyxJQUFBLGVBQU8sRUFDbkIsV0FBVyxDQUFDLElBQUEsY0FBTSxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFBLGNBQU0sRUFBQyx5QkFBZSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQ2hFO2FBQ0UsT0FBTyxDQUFDLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzthQUNsQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLG1GQUFtRjtJQUNyRixDQUFDLENBQUMsQ0FDSCxDQUFDO0FBQ0osQ0FBQztBQVpELDRDQVlDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxPQUE2QixFQUFFLEtBQWE7SUFBYixzQkFBQSxFQUFBLGFBQWE7SUFDbEUsSUFBSSxDQUFDLFlBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7UUFDeEMsSUFBSSxLQUFLO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDLENBQUM7UUFDcEQsT0FBTztLQUNSO0lBRUQsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBRTFCLElBQU0sT0FBTyxHQUFHLFlBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsSUFBSSxPQUFPLEVBQUU7UUFDWCxJQUFJLEtBQUs7WUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztRQUM3RCxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSTtZQUM1QixJQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNyRCxJQUFJLFlBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ3ZDLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzNDO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDdkI7UUFDSCxDQUFDLENBQUMsQ0FBQztLQUNKO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQXRCRCwwQkFzQkM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLElBQVk7SUFDaEMsSUFBTSxvQkFBb0IsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BELElBQU0sV0FBVyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHVDQUF1QztJQUUzRixJQUFJLG9CQUFvQixJQUFJLFdBQVcsRUFBRTtRQUN2QyxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBVEQsc0JBU0M7QUFFRDs7OztHQUlHO0FBQ0ksSUFBTSxPQUFPLEdBQUcsVUFBQyxJQUFTO0lBQy9CLElBQUksSUFBSSxLQUFLLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQztJQUMvQixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUN0RSxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVc7UUFBRSxPQUFPLElBQUksQ0FBQztJQUM3QyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUM1QixJQUFJLElBQUksS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7S0FDN0I7SUFDRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUM1QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDMUQsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQy9ELE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQWJXLFFBQUEsT0FBTyxXQWFsQjtBQUVGOztHQUVHO0FBQ0gsSUFBTSxnQkFBZ0IsR0FBa0IsRUFBRSxDQUFDO0FBRTNDOzs7O0dBSUc7QUFDSCxTQUFnQixjQUFjLENBQUMsR0FBVztJQUN4QyxJQUFJLE9BQU8sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUztRQUFFLE9BQU8sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0UsSUFBSSxHQUFRLENBQUM7SUFFYixJQUFJO1FBQ0YsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUM7SUFDdkUsSUFBSSxRQUFRLEVBQUU7UUFDWixnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUM7S0FDbEM7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBZkQsd0NBZUMifQ==