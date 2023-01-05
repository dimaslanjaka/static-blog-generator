"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpCached = exports.md5 = exports.getShaFile = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var crypto_1 = __importDefault(require("crypto"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var os_1 = require("os");
var persistent_cache_1 = require("persistent-cache");
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
var gulp_config_1 = require("../gulp.config");
var fm_1 = require("../utils/fm");
var hash_1 = require("../utils/hash");
var scheduler_1 = __importDefault(require("../utils/scheduler"));
function getShaFile(file) {
    if (fs_extra_1.default.statSync(file).isDirectory())
        return null;
    var testFile = fs_extra_1.default.readFileSync(file);
    var sha1sum = crypto_1.default.createHash('sha1').update(testFile).digest('hex');
    return sha1sum;
}
exports.getShaFile = getShaFile;
var md5 = function (data) { return crypto_1.default.createHash('md5').update(data).digest('hex'); };
exports.md5 = md5;
function cacheLib(options) {
    var config = (0, gulp_config_1.getConfig)();
    options = Object.assign({ name: 'gulp-cached', base: (0, upath_1.join)(config.cwd, 'tmp'), prefix: '' }, options);
    return (0, persistent_cache_1.persistentCache)(options);
}
function gulpCached(options) {
    var _a;
    if (options === void 0) { options = {}; }
    var caches = cacheLib(options);
    var logname = 'gulp-' + ansi_colors_1.default.grey('cached');
    var caller;
    if (options.name) {
        caller = options.name;
    }
    else {
        caller = (0, hash_1.data_to_hash_sync)('md5', ((_a = new Error('get caller').stack) === null || _a === void 0 ? void 0 : _a.split(/\r?\n/gim).filter(function (str) { return /(dist|src)/i.test(str); })[1]) || '').slice(0, 5);
    }
    var pid = process.pid;
    return through2_1.default.obj(function (file, _enc, next) {
        var _a, _b;
        if (file.isDirectory())
            return next(null, file);
        var cacheKey = (0, exports.md5)(file.path);
        var sha1sum = getShaFile(file.path);
        var isChanged = function () {
            var currentHash = caches.getSync(cacheKey, '');
            var newHash = getShaFile(file.path);
            if (!currentHash) {
                return true;
            }
            if (currentHash && currentHash !== newHash) {
                return true;
            }
            if (options.dest && options.cwd) {
                var destPath = (0, upath_1.join)((0, upath_1.toUnix)(options.dest), (0, upath_1.toUnix)(file.path).replace((0, upath_1.toUnix)(options.cwd), ''));
                return fs_extra_1.default.existsSync(destPath);
            }
            return false;
        };
        var paths = {
            dest: (0, upath_1.toUnix)(((_a = options.dest) === null || _a === void 0 ? void 0 : _a.replace(process.cwd(), '')) || ''),
            cwd: (0, upath_1.toUnix)(((_b = options.cwd) === null || _b === void 0 ? void 0 : _b.replace(process.cwd(), '')) || ''),
            source: (0, upath_1.toUnix)(file.path.replace(process.cwd(), ''))
        };
        var dumpfile = (0, upath_1.join)(process.cwd(), 'tmp/dump/gulp-cached', "".concat(caller, "-").concat(pid, ".log"));
        (0, fm_1.writefile)(dumpfile, "\"".concat(paths.source, "\" is cached ").concat(isChanged(), " with dest validation ").concat(options.dest && options.cwd ? 'true' : 'false') + os_1.EOL, {
            append: true
        });
        scheduler_1.default.add("".concat(logname, " dump ").concat(ansi_colors_1.default.cyan(caller), " pid ").concat(ansi_colors_1.default.yellow(String(pid))), function () {
            return console.log(logname, dumpfile);
        });
        if (isChanged()) {
            caches.setSync(cacheKey, sha1sum);
            if (typeof this.push === 'function')
                this.push(file);
            return next();
        }
        else {
            return next();
        }
    });
}
exports.gulpCached = gulpCached;
exports.default = gulpCached;
