"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeCb = exports.persistentCache = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var upath_1 = __importDefault(require("upath"));
var filemanager_1 = require("./filemanager");
require("./JSON");
var persistentCache = /** @class */ (function () {
    function persistentCache(options) {
        if (options === void 0) { options = {}; }
        this.memoryCache = {};
        this.setSync = this.putSync;
        this.base =
            options.base ||
                (0, filemanager_1.pathJoin)((require.main ? upath_1.default.dirname(require.main.filename) : undefined) || process.cwd(), 'tmp');
        this.name = options.name || 'cache';
        this.persist = typeof options.persist == 'boolean' ? options.persist : true;
        this.memory = typeof options.memory == 'boolean' ? options.memory : true;
        this.duration = options.duration || Infinity;
    }
    /**
     * add cache deferred callback
     * @param key
     * @param data
     * @param cb
     * @returns
     */
    persistentCache.prototype.put = function (key, data, cb) {
        var put = this.putSync(key, data);
        if (put === true) {
            return safeCb(cb)(null);
        }
        else {
            safeCb(cb)(put);
        }
    };
    /**
     * add cache sync
     * @param key
     * @param data
     * @returns boolean=success, any=error
     */
    persistentCache.prototype.putSync = function (key, data) {
        var entry = this.buildCacheEntry(data);
        if (this.persist) {
            // save in file
            try {
                (0, filemanager_1.writefile)(this.buildFilePath(key), JSON.stringifyWithCircularRefs(entry));
            }
            catch (e) {
                return e;
            }
        }
        if (this.memory) {
            // save in memory only
            entry.data = JSON.stringifyWithCircularRefs(entry.data);
            this.memoryCache[key] = entry;
        }
        return true;
    };
    /**
     * add cache async
     * @param key
     * @param data
     * @returns
     */
    persistentCache.prototype.set = function (key, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.put(key, data, function (e) {
                if (!e) {
                    resolve(true);
                }
                else {
                    reject(e);
                }
            });
        });
    };
    /**
     * get cache by key synchronously
     * @param name
     * @param fallback
     * @returns
     */
    persistentCache.prototype.getSync = function (name, fallback) {
        if (this.memory && !!this.memoryCache[name]) {
            var entry = this.memoryCache[name];
            if (entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                return undefined;
            }
            return JSON.parse(entry.data);
        }
        var data;
        try {
            data = JSON.parse(fs_extra_1.default.readFileSync(this.buildFilePath(name), 'utf8'));
        }
        catch (e) {
            return fallback;
        }
        if (data.cacheUntil && new Date().getTime() > data.cacheUntil)
            return fallback;
        return data.data;
    };
    persistentCache.prototype.buildFilePath = function (name) {
        var cacheDir = upath_1.default.normalize(this.base + '/' + (this.name || 'cache'));
        return upath_1.default.normalize(cacheDir + '/' + name + '.json');
    };
    persistentCache.prototype.buildCacheEntry = function (data) {
        var cacheInfinitely = !(typeof this.duration === 'number');
        return {
            cacheUntil: !cacheInfinitely ? new Date().getTime() + this.duration : undefined,
            data: data
        };
    };
    return persistentCache;
}());
exports.persistentCache = persistentCache;
/**
 * safe callback
 * @param cb
 * @returns
 */
function safeCb(cb) {
    if (typeof cb === 'function')
        return cb;
    return function () {
        //
    };
}
exports.safeCb = safeCb;
//# sourceMappingURL=persistent-cache.js.map