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
exports.PATH_SEPARATOR = exports.extname = exports.relative = exports.basename = exports.fsreadDirSync = exports.mkdirSync = exports.rm = exports.rmdirSync = exports.readdirSync = exports.write = exports.join = exports.read = exports.resolve = exports.dirname = exports.cwd = exports.writeFileSync = exports.normalize = exports.globSrc = exports.removeMultiSlashes = exports.cacheDir = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var bluebird_1 = __importDefault(require("bluebird"));
var find_cache_dir_1 = __importDefault(require("find-cache-dir"));
var fs = __importStar(require("fs"));
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
var globSrc = function (pattern, opts) {
    if (opts === void 0) { opts = {}; }
    return new bluebird_1.default(function (resolve, reject) {
        var opt = Object.assign({ cwd: (0, exports.cwd)(), dot: true, matchBase: true }, opts);
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
exports.normalize = upath_1.default.normalize;
exports.writeFileSync = filemanager.write;
var cwd = function () { return upath_1.default.toUnix((0, process_1.cwd)()); };
exports.cwd = cwd;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9maWxlbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUFzRTtBQUN0RSxzREFBZ0M7QUFDaEMsa0VBQTBDO0FBQzFDLHFDQUF5QjtBQUN6Qiw4Q0FBMkM7QUFDM0MsbUNBQXlDO0FBQ3pDLGdEQUEwQjtBQUMxQiw2Q0FBOEM7QUFDOUMsK0JBQXFDO0FBRXJDLDJCQUE4QjtBQUM5Qjs7R0FFRztBQUNVLFFBQUEsUUFBUSxHQUFHLElBQUEsd0JBQVksRUFBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO0FBSy9ELElBQU0sT0FBTyxHQUFHLGNBQW9DLENBQUM7QUFDckQsb0JBQW9CO0FBRXBCOzs7O0dBSUc7QUFDSCxTQUFVLFFBQVEsQ0FBQyxHQUFnQjs7Ozs7O2dCQUMzQixLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzs7OztnQkFDeEMsVUFBQSxTQUFBLEtBQUssQ0FBQTs7OztnQkFBYixJQUFJO3FCQUNULElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBbEIsd0JBQWtCO2dCQUNwQixzQkFBQSxTQUFPLFFBQVEsQ0FBQyxJQUFBLFlBQUksRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsRUFBQTs7Z0JBQXJDLFNBQXFDLENBQUM7O29CQUV0QyxxQkFBTSxJQUFBLFlBQUksRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFBOztnQkFBMUIsU0FBMEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQUdoQztBQUVELElB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