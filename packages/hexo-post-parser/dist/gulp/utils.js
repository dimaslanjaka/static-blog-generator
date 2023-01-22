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
exports.isValidHttpUrl = exports.isEmpty = exports.slash = exports.copyDir = exports.loopDir = void 0;
const fs_1 = __importDefault(require("fs"));
const fse = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
//console.log(loopDir(path.join(process.cwd(), "source")));
/**
 * Loop dir recursive
 * @param destDir
 * @param debug
 */
function loopDir(destDir, debug = false) {
    if (!fs_1.default.lstatSync(destDir).isDirectory()) {
        if (debug)
            console.error(destDir + " isn't folder");
        return;
    }
    let result = [];
    const readDir = fs_1.default.readdirSync(destDir);
    if (readDir) {
        if (debug)
            console.log(readDir.length + ' files to process');
        readDir.forEach(function (file) {
            const absolute = path_1.default.join(destDir.toString(), file);
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
function copyDir(source, dest, callback = function (err) {
    if (err) {
        console.error(err);
        console.error('error');
    }
    else {
        console.log('success!');
    }
}) {
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
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
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
const isEmpty = (data) => {
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
const validatedHttpUrl = {};
/**
 * Cacheable validate url is valid and http or https protocol
 * @param str
 * @returns
 */
function isValidHttpUrl(str) {
    if (typeof validatedHttpUrl[str] === 'boolean')
        return validatedHttpUrl[str];
    let url;
    try {
        url = new URL(str);
    }
    catch (_) {
        return false;
    }
    const validate = url.protocol === 'http:' || url.protocol === 'https:';
    if (validate) {
        validatedHttpUrl[str] = validate;
    }
    return validate;
}
exports.isValidHttpUrl = isValidHttpUrl;
//# sourceMappingURL=utils.js.map