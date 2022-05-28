"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidHttpUrl = exports.isEmpty = exports.slash = exports.copyDir = exports.loopDir = exports.determineDirname = exports.replacePath = void 0;
var fs_1 = __importDefault(require("fs"));
var fse = __importStar(require("fs-extra"));
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
 * Determine gulp.dest location
 * @param pipe
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
// eslint-disable-next-line no-unused-vars
function copyDir(source, dest, callback) {
    if (callback === void 0) { callback = function (err) {
        if (err) {
            console.error(err);
            console.error('error');
        }
        else {
            console.log('success!');
        }
    }; }
    return fse.copy(source, dest, callback);
}
exports.copyDir = copyDir;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUFvQjtBQUNwQiw0Q0FBZ0M7QUFDaEMsOENBQXdCO0FBQ3hCLCtCQUF3QztBQUV4Qyw0Q0FBbUQ7QUFDbkQsMkNBQThDO0FBRTlDOzs7Ozs7R0FNRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxHQUFXLEVBQUUsSUFBWSxFQUFFLEVBQVU7SUFDL0QsSUFBTSxTQUFTLEdBQUcsVUFBQyxDQUFTLElBQUssT0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQztJQUN6RCxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsRUFBRSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFORCxrQ0FNQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxJQUE0QjtJQUMzRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQ2QsSUFBQSxtQkFBVSxFQUFDLFVBQUMsSUFBSTtRQUNkLElBQU0sS0FBSyxHQUFHLElBQUEsZUFBTyxFQUNuQixXQUFXLENBQUMsSUFBQSxjQUFNLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUEsY0FBTSxFQUFDLHlCQUFlLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FDaEU7YUFDRSxPQUFPLENBQUMsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ2xDLE9BQU8sQ0FBQyxhQUFhLEVB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