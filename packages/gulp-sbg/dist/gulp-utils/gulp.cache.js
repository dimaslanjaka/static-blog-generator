"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpCached = exports.calculateHash = void 0;
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var persistent_cache_1 = require("persistent-cache");
var through2_1 = __importDefault(require("through2"));
/**
 * calculate sha1sum of file
 * @param file
 * @returns
 */
function calculateHash(file) {
    var testFile = fs_1.default.readFileSync(file);
    var sha1sum = crypto_1.default.createHash('sha1').update(testFile).digest('hex');
    return sha1sum;
}
exports.calculateHash = calculateHash;
/**
 *
 * @param options
 * @returns
 */
function gulpCached(options) {
    if (options === void 0) { options = { name: 'gulp-cached' }; }
    var caches = (0, persistent_cache_1.persistentCache)(options);
    return through2_1.default.obj(function (file, _enc, next) {
        var hasCache = caches.getSync(file.path);
        var sha1sum = calculateHash(file.path);
        if (!hasCache) {
            caches.setSync(file.path, sha1sum);
            return next(null, file);
        }
        else {
            console.log('cached');
        }
        return next(null, file);
    });
}
exports.gulpCached = gulpCached;
