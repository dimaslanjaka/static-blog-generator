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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFileName = exports.PATH_SEPARATOR = exports.extname = exports.relative = exports.basename = exports.fsreadDirSync = exports.mkdirSync = exports.rm = exports.rmdirSync = exports.readdirSync = exports.write = exports.join = exports.read = exports.resolve = exports.dirname = exports.crossNormalize = exports.normalize = exports.globSrc = exports.minimatch_array_filter = exports.minimatch_filter = exports.copyDir = exports.copy = exports.removeMultiSlashes = exports.cacheDir = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var bluebird_1 = __importDefault(require("bluebird"));
var find_cache_dir_1 = __importDefault(require("find-cache-dir"));
var fs = __importStar(require("fs"));
var fse = __importStar(require("fs-extra"));
var minimatch_1 = __importDefault(require("minimatch"));
var path_1 = __importDefault(require("path"));
var process_1 = require("process");
var sanitize_filename_1 = __importDefault(require("sanitize-filename"));
var upath_1 = __importStar(require("upath"));
var array_utils_1 = require("./array-utils");
var JSON_1 = require("./JSON");
var glob = require("glob");
/**
 * node_modules/.cache/${name}
 */
exports.cacheDir = (0, find_cache_dir_1.default)({ name: 'dimaslanjaka' });
var modPath = path_1.default;
//modPath.sep = '/';
/**
 * Directory iterator recursive
 * @param dir
 * @see {@link https://stackoverflow.com/a/66083078/6404439}
 */
function walkSync(dir) {
    var files, files_1, files_1_1, file, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                files = fs.readdirSync(dir, { withFileTypes: true });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, 9, 10]);
                files_1 = __values(files), files_1_1 = files_1.next();
                _b.label = 2;
            case 2:
                if (!!files_1_1.done) return [3 /*break*/, 7];
                file = files_1_1.value;
                if (!file.isDirectory()) return [3 /*break*/, 4];
                return [5 /*yield**/, __values(walkSync((0, exports.join)(dir, file.name)))];
            case 3:
                _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, (0, exports.join)(dir, file.name)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                files_1_1 = files_1.next();
                return [3 /*break*/, 2];
            case 7: return [3 /*break*/, 10];
            case 8:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 10];
            case 9:
                try {
                    if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}
var filemanager = {
    /**
     * @see {@link walkSync}
     */
    readdirSync: walkSync,
    /**
     * Remove dir or file recursive synchronously (non-empty folders supported)
     * @param path
     */
    rmdirSync: function (path, options) {
        if (options === void 0) { options = {}; }
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
    rm: function (path, options, callback) {
        if (options === void 0) { options = {}; }
        if (fs.existsSync(path)) {
            if (typeof options == 'function') {
                return fs.rm(path, { recursive: true }, options);
            }
            else if (typeof options == 'object') {
                return fs.rm(path, Object.assign({ recursive: true }, options), typeof callback == 'function'
                    ? callback
                    : function () {
                        // no callback? do nothing
                    });
            }
        }
    },
    /**
     * Write to file recursively (synchronous)
     * @param path
     * @param content
     * @param append append to file?
     * @returns Promise.resolve(path);
     * @example
     * // write directly
     * const input = write('/folder/file.txt', {'a':'v'});
     * // log here
     * console.log('written successfully');
     * // or log using async
     * input.then((file)=> console.log('written to', file));
     */
    write: function (path, content, append) {
        if (append === void 0) { append = false; }
        return new bluebird_1.default(function (resolve, reject) {
            try {
                var dir = modPath.dirname(path.toString());
                if (!fs.existsSync(dir))
                    fs.mkdirSync(dir, { recursive: true });
                if (typeof content != 'string') {
                    if (typeof content == 'object') {
                        content = (0, JSON_1.json_encode)(content, 4);
                    }
                    else {
                        content = String(content);
                    }
                }
                if (!append) {
                    fs.writeFileSync(path, content);
                }
                else {
                    fs.appendFileSync(path, content);
                }
                resolve(path);
            }
            catch (error) {
                reject(error);
            }
        });
    },
    /**
     * Make directory recursive default (only not exists dir)
     * @param path
     * @param options
     * @returns
     */
    mkdirSync: function (path, options) {
        if (options === void 0) { options = {}; }
        if (!fs.existsSync(path))
            return fs.mkdirSync(path, Object.assign({ recursive: true }, options));
    }
};
function removeMultiSlashes(str) {
    return str.replace(/(\/)+/g, '$1');
}
exports.removeMultiSlashes = removeMultiSlashes;
/**
 * copy dir or file recursive
 * @param src source path of file or folder
 * @param dest destination path
 */
function copy(src, dest) {
    if (!fs.existsSync(src))
        throw new Error("".concat(src, " not exists"));
    var dirDest = (0, exports.dirname)(dest);
    var stat = fs.statSync(src);
    if (!fs.existsSync(dirDest))
        (0, exports.mkdirSync)(dirDest, { recursive: true });
    if (stat.isFile())
        fs.copyFileSync(src, dest);
    if (stat.isDirectory())
        copyDir(src, dest);
}
exports.copy = copy;
/**
 * copy directory recursive
 * @param source
 * @param dest
 * @param callback
 * @returns
 */
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
 * minimatch advanced filter single pattern
 * @see {@link https://codesandbox.io/s/minimatch-file-list-y22tf8?file=/src/index.js}
 * @param pattern
 * @param str
 * @returns
 */
function minimatch_filter(pattern, str) {
    if (typeof pattern === 'string') {
        return ((0, minimatch_1.default)(str, pattern, { matchBase: true, dot: true }) ||
            str.includes(pattern));
    }
    else if (pattern instanceof RegExp) {
        return pattern.test(str);
    }
}
exports.minimatch_filter = minimatch_filter;
/**
 * minimatch advanced filter multiple pattern
 * @see {@link https://codesandbox.io/s/minimatch-file-list-y22tf8?file=/src/index.js}
 * @param patterns
 * @param str
 * @returns
 * @example
 * ['unit/x', 'sh', 'xxx', 'shortcodes/xxx'].filter((file) => {
 *  const patterns = ["unit", "shortcodes"];
 *  return minimatch_array_filter(patterns, file);
 * }); // ['sh', 'xxx']
 */
function minimatch_array_filter(patterns, str) {
    var map = patterns.map(function (pattern) { return minimatch_filter(pattern, str); });
    return map.every(function (v) { return v === false; });
}
exports.minimatch_array_filter = minimatch_array_filter;
/**
 * glob source (gulp.src like)
 * @param pattern
 * @param opts
 * @see {@link https://codesandbox.io/s/minimatch-file-list-y22tf8?file=/src/index.js}
 * @returns
 */
var globSrc = function (pattern, opts) {
    if (opts === void 0) { opts = {}; }
    return new bluebird_1.default(function (resolve, reject) {
        var opt = Object.assign({ cwd: (0, process_1.cwd)(), dot: true, matchBase: true }, opts);
        var excludePattern;
        if (opt.use) {
            excludePattern = opt.ignore;
            opt.ignore = undefined;
        }
        glob(pattern, opt, function (err, files) {
            if (err) {
                return reject(err);
            }
            var result = files.map(upath_1.default.toUnix);
            if (opt.use) {
                result = files.map(upath_1.default.toUnix).filter(function (file) {
                    if (typeof excludePattern === 'string') {
                        return minimatch_filter(excludePattern, file);
                    }
                    else if (Array.isArray(excludePattern)) {
                        return minimatch_array_filter(excludePattern, file);
                    }
                    return false;
                });
            }
            return resolve(result);
        });
    });
};
exports.globSrc = globSrc;
exports.default = filemanager;
/**
 * cross-platform normalize path to lowercase windows drive letters
 * @param path
 * @returns
 */
function normalize(path) {
    var isWin = process.platform === 'win32';
    if (isWin) {
        if (path.includes(':')) {
            var split = path.split(':');
            var letter = split[0].toLowerCase();
            var perm = split[1];
            return (0, upath_1.toUnix)("".concat(letter, ":").concat(perm));
        }
    }
    return (0, upath_1.toUnix)(path);
}
exports.normalize = normalize;
/**
 * Cross platform normalizer path
 * @see {@link normalize}
 */
exports.crossNormalize = normalize;
var dirname = function (str) {
    return removeMultiSlashes(upath_1.default.toUnix(upath_1.default.dirname(str)));
};
exports.dirname = dirname;
/**
 * @see {@link upath.resolve}
 * @param str
 * @param opt
 * @returns
 */
var resolve = function (str, opt) {
    if (opt === void 0) { opt = {}; }
    var res = removeMultiSlashes(upath_1.default.toUnix(upath_1.default.resolve(str)));
    opt = Object.assign({
        validate: false
    }, opt);
    if (opt.validate) {
        if (fs.existsSync(res))
            return res;
        return null;
    }
    return res;
};
exports.resolve = resolve;
function read(path, opt) {
    if (fs.existsSync(path))
        return fs.readFileSync(path, opt);
    return null;
}
exports.read = read;
/**
 * smart join to unix path
 * * removes empty/null/undefined
 * @param str
 * @returns
 */
var join = function () {
    var str = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        str[_i] = arguments[_i];
    }
    str = (0, array_utils_1.removeEmpties)(str.map(function (s) { return String(s); }));
    return removeMultiSlashes(upath_1.default.toUnix(path_1.default.join.apply(path_1.default, __spreadArray([], __read(str), false))));
};
exports.join = join;
exports.write = filemanager.write, exports.readdirSync = filemanager.readdirSync, exports.rmdirSync = filemanager.rmdirSync, exports.rm = filemanager.rm, exports.mkdirSync = filemanager.mkdirSync;
exports.fsreadDirSync = fs.readdirSync;
exports.basename = upath_1.default.basename, exports.relative = upath_1.default.relative, exports.extname = upath_1.default.extname;
exports.PATH_SEPARATOR = modPath.sep;
function sanitizeFileName(name, replacement) {
    if (replacement === void 0) { replacement = '-'; }
    var sanitize = (0, sanitize_filename_1.default)(name, { replacement: replacement })
        // replace non-alphanumerics
        .replace(/\W/g, '-')
        // replace multiple hypens
        .replace(/-+/g, '-');
    return sanitize;
}
exports.sanitizeFileName = sanitizeFileName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9maWxlbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUFzRTtBQUN0RSxzREFBZ0M7QUFDaEMsa0VBQTBDO0FBQzFDLHFDQUF5QjtBQUN6Qiw0Q0FBZ0M7QUFDaEMsd0RBQWtDO0FBQ2xDLDhDQUEyQztBQUMzQyxtQ0FBOEI7QUFDOUIsd0VBQTJDO0FBQzNDLDZDQUFzQztBQUN0Qyw2Q0FBOEM7QUFDOUMsK0JBQXFDO0FBQ3JDLDJCQUE4QjtBQUU5Qjs7R0FFRztBQUNVLFFBQUEsUUFBUSxHQUFHLElBQUEsd0JBQVksRUFBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0FBSy9ELElBQU0sT0FBTyxHQUFHLGNBQW9DLENBQUM7QUFDckQsb0JBQW9CO0FBRXBCOzs7O0dBSUc7QUFDSCxTQUFVLFFBQVEsQ0FBQyxHQUFnQjs7Ozs7O2dCQUMzQixLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzs7OztnQkFDeEMsVUFBQSxTQUFBLEtBQUssQ0FBQTs7OztnQkFBYixJQUFJO3FCQUNULElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBbEIsd0JBQWtCO2dCQUNwQixzQkFBQSxTQUFPLFFBQVEsQ0FBQyxJQUFBLFlBQUksRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsRUFBQTs7Z0JBQXJDLFNBQXFDLENBQUM7O29CQUV0QyxxQkFBTSxJQUFBLFlBQUksRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFBOztnQkFBMUIsU0FB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