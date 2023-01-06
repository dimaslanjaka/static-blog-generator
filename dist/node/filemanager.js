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
exports.PATH_SEPARATOR = exports.extname = exports.relative = exports.basename = exports.statSync = exports.appendFileSync = exports.readFileSync = exports.existsSync = exports.fsreadDirSync = exports.mkdirSync = exports.rm = exports.rmdirSync = exports.readdirSync = exports.write = exports.join = exports.read = exports.resolve = exports.dirname = exports.cwd = exports.writeFileSync = exports.globSrc = exports.removeMultiSlashes = exports.cacheDir = exports.normalize = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const bluebird_1 = __importDefault(require("bluebird"));
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
const true_case_path_1 = require("true-case-path");
const upath_1 = __importStar(require("upath"));
const JSON_1 = require("./JSON");
const glob = require("glob");
/**
 * cross-platform normalize path to fixed-case windows drive letters
 * @link https://www.npmjs.com/package/true-case-path
 * @param path
 * @returns unix-style path separator
 */
function normalize(path) {
    if ((0, exports.existsSync)(path) && process.platform === 'win32')
        return (0, upath_1.toUnix)((0, true_case_path_1.trueCasePathSync)(path));
    return (0, upath_1.toUnix)(path);
}
exports.normalize = normalize;
/**
 * node_modules/.cache/${name}
 */
exports.cacheDir = upath_1.default.join(process.cwd(), 'tmp/hexo-post-parser');
if (!fs.existsSync(upath_1.default.dirname(exports.cacheDir)))
    fs.mkdirpSync(upath_1.default.dirname(exports.cacheDir));
const modPath = path_1.default;
//modPath.sep = '/';
/**
 * Directory iterator recursive
 * @param dir
 * @param done
 */
// eslint-disable-next-line no-unused-vars
const walk = function (dir, done) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err)
            return done(err);
        let pending = list.length;
        if (!pending)
            return done(null, results);
        list.forEach(function (file) {
            file = modPath.resolve(dir.toString(), file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res || []);
                        if (!--pending)
                            done(null, results);
                    });
                }
                else {
                    results.push(file);
                    if (!--pending)
                        done(null, results);
                }
            });
        });
    });
};
const filemanager = {
    // eslint-disable-next-line no-unused-vars
    readdirSync: (path, callback) => {
        return walk(path, callback);
    },
    /**
     * Remove dir or file recursive synchronously (non-empty folders supported)
     * @param path
     */
    rmdirSync: (path, options = {}) => {
        if (fs.existsSync(path))
            return fs.rmSync(path, Object.assign({ recursive: true }, options));
    },
    /**
     * remove dir or file recursive asynchronously
     * @param path
     * @param options
     * @param callback
     * @returns
     */
    rm: (path, options = {}, callback) => {
        if (fs.existsSync(path)) {
            fs.rm(path, Object.assign({ recursive: true }, options));
            if (typeof options == 'function') {
                options(null);
            }
            else if (typeof callback === 'function') {
                callback(null);
            }
        }
    },
    /**
     * Write to file recursively (synchronous)
     * @param path
     * @param content
     * @returns Promise.resolve(path);
     * @example
     * // write directly
     * const input = write('/folder/file.txt', {'a':'v'});
     * // log here
     * console.log('written successfully');
     * // or log using async
     * input.then((file)=> console.log('written to', file));
     */
    write: (path, content) => {
        const dir = modPath.dirname(path.toString());
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        if (typeof content != 'string') {
            if (typeof content == 'object') {
                content = (0, JSON_1.json_encode)(content);
            }
            else {
                content = String(content);
            }
        }
        fs.writeFileSync(path, content);
        return bluebird_1.default.resolve(path);
    },
    /**
     * Make directory recursive default (only not exists dir)
     * @param path
     * @param options
     * @returns
     */
    mkdirSync: (path, options = {}) => {
        if (!(0, exports.existsSync)(path))
            return fs.mkdirSync(path, Object.assign({ recursive: true }, options));
    }
};
function removeMultiSlashes(str) {
    return str.replace(/(\/)+/g, '$1');
}
exports.removeMultiSlashes = removeMultiSlashes;
const globSrc = function (pattern, opts = {}) {
    return new bluebird_1.default((resolve, reject) => {
        const opt = Object.assign({ cwd: (0, exports.cwd)(), dot: true, matchBase: true }, opts);
        glob(pattern, opt, function (err, files) {
            if (err) {
                return reject(err);
            }
            resolve(files.map(upath_1.default.toUnix));
        });
    });
};
exports.globSrc = globSrc;
exports.default = filemanager;
exports.writeFileSync = filemanager.write;
const cwd = () => upath_1.default.toUnix((0, process_1.cwd)());
exports.cwd = cwd;
const dirname = (str) => removeMultiSlashes(upath_1.default.toUnix(upath_1.default.dirname(str)));
exports.dirname = dirname;
/**
 * @see {@link upath.resolve}
 * @param str
 * @param opt
 * @returns
 */
const resolve = (str, opt = {}) => {
    const res = removeMultiSlashes(upath_1.default.toUnix(upath_1.default.resolve(str)));
    opt = Object.assign({
        validate: false
    }, opt);
    if (opt.validate) {
        if ((0, exports.existsSync)(res))
            return res;
        return null;
    }
    return res;
};
exports.resolve = resolve;
/**
 * nullable read file synchronous
 * @param path
 * @param opt
 * @returns
 */
function read(path, opt) {
    if ((0, exports.existsSync)(path))
        return (0, exports.readFileSync)(path, opt);
    return null;
}
exports.read = read;
/**
 * smart join to unix path
 * * removes empty/null/undefined
 * @param str
 * @returns
 */
exports.join = upath_1.default.join;
exports.write = filemanager.write, exports.readdirSync = filemanager.readdirSync, exports.rmdirSync = filemanager.rmdirSync, exports.rm = filemanager.rm, exports.mkdirSync = filemanager.mkdirSync;
exports.fsreadDirSync = fs.readdirSync;
exports.existsSync = fs.existsSync, exports.readFileSync = fs.readFileSync, exports.appendFileSync = fs.appendFileSync, exports.statSync = fs.statSync;
exports.basename = upath_1.default.basename, exports.relative = upath_1.default.relative, exports.extname = upath_1.default.extname;
exports.PATH_SEPARATOR = modPath.sep;
//# sourceMappingURL=filemanager.js.map