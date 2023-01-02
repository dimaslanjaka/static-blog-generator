"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpCached = exports.md5 = exports.getShaFile = void 0;
var tslib_1 = require("tslib");
var crypto_1 = tslib_1.__importDefault(require("crypto"));
var fs_1 = tslib_1.__importStar(require("fs"));
var persistent_cache_1 = require("persistent-cache");
var through2_1 = tslib_1.__importDefault(require("through2"));
var upath_1 = require("upath");
var gulp_config_1 = require("../gulp.config");
var logger_1 = tslib_1.__importDefault(require("../utils/logger"));
function getShaFile(file) {
    if (fs_1.default.statSync(file).isDirectory())
        return null;
    var testFile = fs_1.default.readFileSync(file);
    var sha1sum = crypto_1.default.createHash('sha1').update(testFile).digest('hex');
    return sha1sum;
}
exports.getShaFile = getShaFile;
var md5 = function (data) { return crypto_1.default.createHash('md5').update(data).digest('hex'); };
exports.md5 = md5;
function gulpCached(options) {
    if (options === void 0) { options = {}; }
    var config = (0, gulp_config_1.getConfig)();
    options = Object.assign({ name: 'gulp-cached', base: (0, upath_1.join)(config.cwd, 'tmp'), prefix: '' }, options);
    var caches = (0, persistent_cache_1.persistentCache)(options);
    return through2_1.default.obj(function (file, _enc, next) {
        var _a, _b;
        if (file.isDirectory())
            return next(null, file);
        var cacheKey = (0, exports.md5)(file.path);
        var getCache = caches.getSync(cacheKey, '');
        var sha1sum = getShaFile(file.path);
        var isCached = getCache.trim().length > 0 && sha1sum === getCache;
        var paths = {
            dest: (0, upath_1.toUnix)(((_a = options.dest) === null || _a === void 0 ? void 0 : _a.replace(process.cwd(), '')) || ''),
            cwd: (0, upath_1.toUnix)(((_b = options.cwd) === null || _b === void 0 ? void 0 : _b.replace(process.cwd(), '')) || ''),
            source: (0, upath_1.toUnix)(file.path.replace(process.cwd(), ''))
        };
        if (options.dest && options.cwd) {
            var destPath = (0, upath_1.join)((0, upath_1.toUnix)(options.dest), (0, upath_1.toUnix)(file.path).replace((0, upath_1.toUnix)(options.cwd), ''));
            if (!(0, fs_1.existsSync)(destPath))
                isCached = false;
            logger_1.default.log(destPath);
        }
        logger_1.default.log(paths.source, 'cached', isCached);
        if (!isCached) {
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
