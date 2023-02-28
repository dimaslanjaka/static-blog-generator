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
                // cache expired
                return fallback;
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
    persistentCache.prototype.get = function (name, fallback) {
        var _this = this;
        if (typeof fallback !== 'function') {
            return new Promise(function (resolve) {
                resolve(_this.getSync(name, fallback));
            });
        }
        else {
            if (this.memory && !!this.memoryCache[name]) {
                var entry = this.memoryCache[name];
                if (!!entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                    return safeCb(fallback)(null, undefined);
                }
                try {
                    entry = JSON.parse(entry.data);
                }
                catch (e) {
                    return safeCb(fallback)(e);
                }
                return safeCb(fallback)(null, entry);
            }
            fs_extra_1.default.readFile(this.buildFilePath(name), 'utf8', function (err, content) {
                if (err != null) {
                    return safeCb(fallback)(null, undefined);
                }
                var entry;
                try {
                    entry = JSON.parse(content);
                }
                catch (e) {
                    return safeCb(fallback)(e);
                }
                if (!!entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                    return safeCb(fallback)(null, undefined);
                }
                return safeCb(fallback)(null, entry.data);
            });
        }
    };
    /**
     * delete cache
     * @param name cache key
     * @param cb
     */
    persistentCache.prototype.deleteEntry = function (name, cb) {
        if (this.memory) {
            delete this.memoryCache[name];
            if (!this.persist)
                safeCb(cb)(null);
        }
        fs_extra_1.default.unlink(this.buildFilePath(name), cb);
    };
    /**
     * delete cache sync
     * @param name cache key
     * @returns
     */
    persistentCache.prototype.deleteEntrySync = function (name) {
        if (this.memory) {
            delete this.memoryCache[name];
            if (!this.persist)
                return;
        }
        fs_extra_1.default.unlinkSync(this.buildFilePath(name));
    };
    persistentCache.prototype.getCacheDir = function () {
        return upath_1.default.normalize(this.base + '/' + (this.name || 'cache'));
    };
    /**
     * remove current cache directory
     * @param cb
     * @returns
     */
    persistentCache.prototype.unlink = function (cb) {
        if (this.persist) {
            if (typeof cb !== 'function') {
                return fs_extra_1.default.rmSync(this.getCacheDir(), { recursive: true, force: true });
            }
            else {
                return fs_extra_1.default.rm(this.getCacheDir(), { recursive: true, force: true }, safeCb(cb));
            }
        }
        safeCb(cb)(null);
    };
    persistentCache.prototype.transformFileNameToKey = function (fileName) {
        return fileName.slice(0, -5);
    };
    /**
     * get all cache keys
     * @param cb
     * @returns
     */
    persistentCache.prototype.keys = function (cb) {
        var self = this;
        cb = safeCb(cb);
        if (this.memory && !this.persist)
            return cb(null, Object.keys(this.memoryCache));
        fs_extra_1.default.readdir(this.getCacheDir(), onDirRead);
        function onDirRead(err, files) {
            return err ? cb(err) : cb(err, files.map(self.transformFileNameToKey));
        }
    };
    /**
     * get cache keys sync
     * @returns
     */
    persistentCache.prototype.keysSync = function () {
        var self = this;
        if (this.memory && !this.persist)
            return Object.keys(this.memoryCache);
        if (fs_extra_1.default.existsSync(this.getCacheDir())) {
            return fs_extra_1.default.readdirSync(this.getCacheDir()).map(self.transformFileNameToKey);
        }
        else {
            return [];
        }
    };
    /**
     * get all values
     * @returns
     */
    persistentCache.prototype.valuesSync = function () {
        var _this = this;
        return this.keysSync().map(function (key) {
            return _this.getSync(key);
        });
    };
    persistentCache.prototype.buildFilePath = function (name) {
        return upath_1.default.normalize(this.getCacheDir() + '/' + name + '.json');
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