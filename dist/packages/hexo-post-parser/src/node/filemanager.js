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
var bluebird_1 = __importDefault(require("bluebird"));
var fs = __importStar(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var process_1 = require("process");
var true_case_path_1 = require("true-case-path");
var upath_1 = __importStar(require("upath"));
var JSON_1 = require("./JSON");
var glob = require("glob");
function normalize(path) {
    if ((0, exports.existsSync)(path) && process.platform === 'win32')
        return (0, upath_1.toUnix)((0, true_case_path_1.trueCasePathSync)(path));
    return (0, upath_1.toUnix)(path);
}
exports.normalize = normalize;
exports.cacheDir = upath_1.default.join(process.cwd(), 'tmp/hexo-post-parser');
if (!fs.existsSync(upath_1.default.dirname(exports.cacheDir)))
    fs.mkdirpSync(upath_1.default.dirname(exports.cacheDir));
var modPath = path_1.default;
var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err)
            return done(err);
        var pending = list.length;
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
var filemanager = {
    readdirSync: function (path, callback) {
        return walk(path, callback);
    },
    rmdirSync: function (path, options) {
        if (options === void 0) { options = {}; }
        if (fs.existsSync(path))
            return fs.rmSync(path, Object.assign({ recursive: true }, options));
    },
    rm: function (path, options, callback) {
        if (options === void 0) { options = {}; }
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
    write: function (path, content) {
        var dir = modPath.dirname(path.toString());
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
    mkdirSync: function (path, options) {
        if (options === void 0) { options = {}; }
        if (!(0, exports.existsSync)(path))
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
exports.writeFileSync = filemanager.write;
var cwd = function () { return upath_1.default.toUnix((0, process_1.cwd)()); };
exports.cwd = cwd;
var dirname = function (str) {
    return removeMultiSlashes(upath_1.default.toUnix(upath_1.default.dirname(str)));
};
exports.dirname = dirname;
var resolve = function (str, opt) {
    if (opt === void 0) { opt = {}; }
    var res = removeMultiSlashes(upath_1.default.toUnix(upath_1.default.resolve(str)));
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
function read(path, opt) {
    if ((0, exports.existsSync)(path))
        return (0, exports.readFileSync)(path, opt);
    return null;
}
exports.read = read;
exports.join = upath_1.default.join;
exports.write = filemanager.write, exports.readdirSync = filemanager.readdirSync, exports.rmdirSync = filemanager.rmdirSync, exports.rm = filemanager.rm, exports.mkdirSync = filemanager.mkdirSync;
exports.fsreadDirSync = fs.readdirSync;
exports.existsSync = fs.existsSync, exports.readFileSync = fs.readFileSync, exports.appendFileSync = fs.appendFileSync, exports.statSync = fs.statSync;
exports.basename = upath_1.default.basename, exports.relative = upath_1.default.relative, exports.extname = upath_1.default.extname;
exports.PATH_SEPARATOR = modPath.sep;
