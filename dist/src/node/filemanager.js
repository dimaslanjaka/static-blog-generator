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
        return bluebird_1.default.resolve(path);
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