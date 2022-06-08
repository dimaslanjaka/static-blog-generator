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
exports.PATH_SEPARATOR = exports.extname = exports.relative = exports.basename = exports.fsreadDirSync = exports.mkdirSync = exports.rm = exports.rmdirSync = exports.readdirSync = exports.write = exports.join = exports.read = exports.resolve = exports.dirname = exports.normalize = exports.globSrc = exports.minimatch_array_filter = exports.minimatch_filter = exports.copyDir = exports.copy = exports.removeMultiSlashes = exports.cacheDir = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var bluebird_1 = __importDefault(require("bluebird"));
var find_cache_dir_1 = __importDefault(require("find-cache-dir"));
var fs = __importStar(require("fs"));
var fse = __importStar(require("fs-extra"));
var minimatch_1 = __importDefault(require("minimatch"));
var path_1 = __importDefault(require("path"));
var process_1 = require("process");
var upath_1 = __importDefault(require("upath"));
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
exports.normalize = upath_1.default.normalize;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9maWxlbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUFzRTtBQUN0RSxzREFBZ0M7QUFDaEMsa0VBQTBDO0FBQzFDLHFDQUF5QjtBQUN6Qiw0Q0FBZ0M7QUFDaEMsd0RBQWtDO0FBQ2xDLDhDQUEyQztBQUMzQyxtQ0FBOEI7QUFDOUIsZ0RBQTBCO0FBQzFCLDZDQUE4QztBQUM5QywrQkFBcUM7QUFDckMsMkJBQThCO0FBRTlCOztHQUVHO0FBQ1UsUUFBQSxRQUFRLEdBQUcsSUFBQSx3QkFBWSxFQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFLL0QsSUFBTSxPQUFPLEdBQUcsY0FBb0MsQ0FBQztBQUNyRCxvQkFBb0I7QUFFcEI7Ozs7R0FJRztBQUNILFNBQVUsUUFBUSxDQUFDLEdBQWdCOzs7Ozs7Z0JBQzNCLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDOzs7O2dCQUN4QyxVQUFBLFNBQUEsS0FBSyxDQUFBOzs7O2dCQUFiLElBQUk7cUJBQ1QsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFsQix3QkFBa0I7Z0JBQ3BCLHNCQUFBLFNBQU8sUUFBUSxDQUFDLElBQUEsWUFBSSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxFQUFBOztnQkFBckMsU0FBcUMsQ0FBQzs7b0JBRXRDLHFCQUFNLElBQUEsWUFBSSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUE7O2dCQUExQixTQUEwQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBR2hDO0FBRUQsSUFBTSxXQUFXLEdBQUc7SUFDbEI7O09BRUc7SUFDSCxXQUFXLEVBQUUsUUFBUTtJQUVyQjs7O09BR0c7SUFDSCxTQUFTLEVBQUUsVUFBQyxJQUFpQixFQUFFLE9BQTBCO1FBQTFCLHdCQUFBLEVBQUEsWUFBMEI7UUFDdkQsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUNyQixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsRUFBRSxFQUFFLFVBQ0YsSUFBaUIsRUFDakIsT0FBK0MsRUFDL0MsUUFBNkI7UUFEN0Isd0JBQUEsRUFBQSxZQUErQztRQUcvQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsSUFBSSxPQUFPLE9BQU8sSUFBSSxVQUFVLEVBQUU7Z0JBQ2hDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDbEQ7aUJBQU0sSUFBSSxPQUFPLE9BQU8sSUFBSSxRQUFRLEVBQUU7Z0JBQ3JDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FDVixJQUFJLEVBQ0osTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFDM0MsT0FBTyxRQUFRLElBQUksVUFBVTtvQkFDM0IsQ0FBQyxDQUFDLFFBQVE7b0JBQ1YsQ0FBQyxDQUFDO3dCQUNFLDBCQUEwQjtvQkFDNUIsQ0FBQyxDQUNOLENBQUM7YUFDSDtTQUNGO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxLQUFLLEVBQUUsVUFBQyxJQUFpQixFQUFFLE9BQVksRUFBRSxNQUFjO1FBQWQsdUJBQUEsRUFBQSxjQUFjO1FBQ3JELElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNoRSxJQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRTtZQUM5QixJQUFJLE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRTtnQkFDOUIsT0FBTyxHQUFHLElBQUEsa0JBQVcsRUFBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDbkM7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMzQjtTQUNGO1FBQ0QsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO2FBQU07WUFDTCxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNsQztRQUNELE9BQU8sa0JBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBUyxFQUFFLFVBQUMsSUFBaUIsRUFBRSxPQUFxQztRQUFyQyx3QkFBQSxFQUFBLFlBQXFDO1FBQ2xFLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0NBQ0YsQ0FBQztBQUVGLFNBQWdCLGtCQUFrQixDQUFDLEdBQVc7SUFDNUMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBRkQsZ0RBRUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFDLEdBQVcsRUFBRSxJQUFZO0lBQzVDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBRyxHQUFHLGdCQUFhLENBQUMsQ0FBQztJQUU5RCxJQUFNLE9BQU8sR0FBRyxJQUFBLGVBQU8sRUFBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixJQUFNLElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztRQUFFLElBQUEsaUJBQVMsRUFBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNyRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFSRCxvQkFRQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLE9BQU8sQ0FDckIsTUFBYyxFQUNkLElBQVksRUFDWixRQU9DO0lBUEQseUJBQUEsRUFBQSxxQkFBcUIsR0FBZTtRQUNsQyxJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN4QjthQUFNO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBYkQsMEJBYUM7QUFTRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxPQUF3QixFQUFFLEdBQVc7SUFDcEUsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDL0IsT0FBTyxDQUNMLElBQUEsbUJBQVMsRUFBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDdkQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FDdEIsQ0FBQztLQUNIO1NBQU0sSUFBSSxPQUFPLFlBQVksTUFBTSxFQUFFO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjtBQUNILENBQUM7QUFURCw0Q0FTQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsU0FBZ0Isc0JBQXNCLENBQUMsUUFBa0IsRUFBRSxHQUFXO0lBQ3BFLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQyxPQUFPLElBQUssT0FBQSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQTlCLENBQThCLENBQUMsQ0FBQztJQUN0RSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBQyxDQUFVLElBQUssT0FBQSxDQUFDLEtBQUssS0FBSyxFQUFYLENBQVcsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFIRCx3REFHQztBQUVEOzs7Ozs7R0FNRztBQUNJLElBQU0sT0FBTyxHQUFHLFVBQVUsT0FBZSxFQUFFLElBQXlCO0lBQXpCLHFCQUFBLEVBQUEsU0FBeUI7SUFDekUsT0FBTyxJQUFJLGtCQUFRLENBQUMsVUFBQyxPQUErQixFQUFFLE1BQU07UUFDMUQsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFBLGFBQUcsR0FBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVFLElBQUksY0FBMEMsQ0FBQztRQUMvQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDWCxjQUFjLEdBQUcsR0FBRyxDQUFDLE1BQW9DLENBQUM7WUFDMUQsR0FBRyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7U0FDeEI7UUFDRCxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEdBQUcsRUFBRSxLQUFLO1lBQ3JDLElBQUksR0FBRyxFQUFFO2dCQUNQLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3BCO1lBQ0QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNYLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJO29CQUMzQyxJQUFJLE9BQU8sY0FBYyxLQUFLLFFBQVEsRUFBRTt3QkFDdEMsT0FBTyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQy9DO3lCQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTt3QkFDeEMsT0FBTyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ3JEO29CQUNELE9BQU8sS0FBSyxDQUFDO2dCQUNmLENBQUMsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBMUJXLFFBQUEsT0FBTyxXQTBCbEI7QUFFRixrQkFBZSxXQUFXLENBQUM7QUFDZCxRQUFBLFNBQVMsR0FBRyxlQUFLLENBQUMsU0FBUyxDQUFDO0FBQ2xDLElBQU0sT0FBTyxHQUFHLFVBQUMsR0FBVztJQUNqQyxPQUFBLGtCQUFrQixDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQXBELENBQW9ELENBQUM7QUFEMUMsUUFBQSxPQUFPLFdBQ21DO0FBUXZEOzs7OztHQUtHO0FBQ0ksSUFBTSxPQUFPLEdBQUcsVUFBQyxHQUFXLEVBQUUsR0FBMEI7SUFBMUIsb0JBQUEsRUFBQSxRQUEwQjtJQUM3RCxJQUFNLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUFDLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUNqQjtRQUNFLFFBQVEsRUFBRSxLQUFLO0tBQ2hCLEVBQ0QsR0FBRyxDQUNKLENBQUM7SUFDRixJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUU7UUFDaEIsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sR0FBRyxDQUFDO1FBQ25DLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQWJXLFFBQUEsT0FBTyxXQWFsQjtBQVNGLFNBQWdCLElBQUksQ0FDbEIsSUFBWSxFQUNaLEdBQTJDO0lBRTNDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFBRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQU5ELG9CQU1DO0FBRUQ7Ozs7O0dBS0c7QUFDSSxJQUFNLElBQUksR0FBRztJQUFDLGFBQWE7U0FBYixVQUFhLEVBQWIscUJBQWEsRUFBYixJQUFhO1FBQWIsd0JBQWE7O0lBQ2hDLEdBQUcsR0FBRyxJQUFBLDJCQUFhLEVBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBVCxDQUFTLENBQUMsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sa0JBQWtCLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxjQUFRLENBQUMsSUFBSSxPQUFiLGNBQVEsMkJBQVMsR0FBRyxXQUFFLENBQUMsQ0FBQztBQUNqRSxDQUFDLENBQUM7QUFIVyxRQUFBLElBQUksUUFHZjtBQUNhLFFBQUEsS0FBSyxHQUE0QyxXQUFXLFFBQXJELFFBQUEsV0FBVyxHQUErQixXQUFXLGNBQXhDLFFBQUEsU0FBUyxHQUFvQixXQUFXLFlBQTdCLFFBQUEsRUFBRSxHQUFnQixXQUFXLEtBQXpCLFFBQUEsU0FBUyxHQUFLLFdBQVcsV0FBQztBQUMvRCxRQUFBLGFBQWEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDO0FBQzdCLFFBQUEsUUFBUSxHQUF3QixlQUFLLFdBQTNCLFFBQUEsUUFBUSxHQUFjLGVBQUssV0FBakIsUUFBQSxPQUFPLEdBQUssZUFBSyxTQUFDO0FBQ3hDLFFBQUEsY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMifQ==