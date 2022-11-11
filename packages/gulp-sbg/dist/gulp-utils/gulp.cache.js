"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpCached = exports.md5 = exports.getShaFile = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var persistent_cache_1 = require("persistent-cache");
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
/**
 * calculate sha1sum of file
 * @param file
 * @returns
 */
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
/**
 *
 * @param options
 * @returns
 */
function gulpCached(options) {
    if (options === void 0) { options = {}; }
    options = Object.assign(options, { name: 'gulp-cached', base: (0, upath_1.join)(process.cwd(), 'tmp') });
    var caches = (0, persistent_cache_1.persistentCache)(options);
    return through2_1.default.obj(function (file, _enc, next) {
        // skip directory
        if (file.isDirectory())
            return next(null, file);
        var cacheKey = (0, exports.md5)(file.path);
        var getCache = caches.getSync(cacheKey);
        var sha1sum = getShaFile(file.path);
        if (!getCache) {
            caches.setSync(cacheKey, sha1sum);
            return next(null, file);
        }
        else if (sha1sum !== getCache) {
            return next(null, file);
        }
        else {
            // drop non-modified data
            return next();
        }
    });
}
exports.gulpCached = gulpCached;
