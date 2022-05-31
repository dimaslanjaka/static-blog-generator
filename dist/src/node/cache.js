"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pcache = exports.defaultResovableValue = exports.dbFolder = void 0;
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var memoizee_1 = __importDefault(require("memoizee"));
var persistent_cache_1 = __importDefault(require("persistent-cache"));
var tiny_typed_emitter_1 = require("tiny-typed-emitter");
var upath_1 = require("upath");
var array_utils_1 = require("./array-utils");
require("./cache-serialize");
var filemanager_1 = require("./filemanager");
var md5_file_1 = require("./md5-file");
var memoize_fs_1 = __importDefault(require("./memoize-fs"));
var scheduler_1 = __importDefault(require("./scheduler"));
/**
 * default folder to save databases
 */
exports.dbFolder = (0, upath_1.toUnix)((0, filemanager_1.resolve)(filemanager_1.cacheDir));
exports.defaultResovableValue = {
    resolveValue: true,
    max: null,
    randomize: false
};
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
var CacheFile = /** @class */ (function (_super) {
    __extends(CacheFile, _super);
    function CacheFile(hash, opt) {
        if (hash === void 0) { hash = null; }
        var _this = _super.call(this) || this;
        _this.total = 0;
        _this.md5Cache = {};
        /**
         * @see {@link CacheFile.set}
         * @param key
         * @param value
         * @returns
         */
        _this.setCache = function (key, value) { return _this.set(key, value); };
        /**
         * locate ${CacheFile.options.folder}/${currentHash}/${unique key hash}
         * @param key
         * @returns
         */
        _this.locateKey = function (key) {
            return (0, filemanager_1.join)(CacheFile.options.folder, _this.currentHash, (0, md5_file_1.md5)(_this.resolveKey(key)));
        };
        _this.getCache = function (key, fallback) {
            if (fallback === void 0) { fallback = null; }
            return _this.get(key, fallback);
        };
        if (opt)
            CacheFile.options = Object.assign(CacheFile.options, opt);
        _this.currentHash = hash;
        if (!hash) {
            var stack = new Error().stack.split('at')[2];
            hash = (0, md5_file_1.md5)(stack);
        }
        if (!(0, fs_1.existsSync)(CacheFile.options.folder))
            (0, filemanager_1.mkdirSync)(CacheFile.options.folder);
        _this.dbFile = (0, filemanager_1.join)(CacheFile.options.folder, 'db-' + hash);
        if (!(0, fs_1.existsSync)(_this.dbFile))
            (0, filemanager_1.write)(_this.dbFile, {});
        var db = (0, filemanager_1.read)(_this.dbFile, 'utf-8');
        if (typeof db == 'string') {
            try {
                db = JSON.parse(db.toString());
            }
            catch (e) {
                console.log('cache database lost');
                //console.log(e);
            }
        }
        if (typeof db == 'object') {
            _this.md5Cache = db;
        }
        return _this;
    }
    CacheFile.prototype.getInstance = function () {
        return this;
    };
    CacheFile.prototype.getTotal = function () {
        this.total = Object.keys(this.md5Cache).length;
        return this.total;
    };
    /**
     * clear cache
     * @returns
     */
    CacheFile.prototype.clear = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var opt = { recursive: true, retryDelay: 3000, maxRetries: 3 };
            // delete current hash folders
            (0, fs_1.rm)((0, filemanager_1.join)(CacheFile.options.folder, _this.currentHash), opt, function (e) {
                // delete current hash db
                (0, fs_1.rm)(_this.dbFile, opt, function (ee) {
                    resolve([e, ee]);
                });
            });
        });
    };
    /**
     * resolve long text on key
     */
    CacheFile.prototype.resolveKey = function (key) {
        // if key is file path
        if ((0, fs_1.existsSync)(key))
            return key;
        // if key is long text
        if (key.length > 32) {
            // search uuid
            var regex = /uuid:.*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gm;
            var m = regex.exec(key);
            if (m && typeof m[1] == 'string')
                return m[1];
            // return first 32 byte text
            return (0, md5_file_1.md5)(key.substring(0, 32));
        }
        return key;
    };
    CacheFile.prototype.dump = function (key) {
        if (key) {
            return {
                resolveKey: this.resolveKey(key),
                locateKey: this.locateKey(key),
                db: this.dbFile
            };
        }
    };
    CacheFile.prototype.set = function (key, value) {
        if (!key) {
            var e = new Error();
            if (!e.stack) {
                try {
                    // IE requires the Error to actually be thrown or else the
                    // Error's 'stack' property is undefined.
                    throw e;
                }
                catch (e) {
                    if (!e.stack) {
                        //return 0; // IE < 10, likely
                    }
                }
            }
            var stack = String(e.stack).split(/\r\n|\n/);
            console.log('cache key empty', stack);
            return;
        }
        var self = this;
        // resolve key hash
        key = this.resolveKey(key);
        // locate key location file
        var locationCache = this.locateKey(key);
        // +key value
        this.md5Cache[key] = locationCache;
        // save cache on process exit
        scheduler_1.default.add('writeCacheFile-' + this.currentHash, function () {
            console.log(chalk_1.default.magentaBright(self.currentHash), 'saved cache', self.dbFile);
            (0, filemanager_1.write)(self.dbFile, JSON.stringify(self.md5Cache));
        });
        if (value)
            (0, filemanager_1.write)(locationCache, JSON.stringify(value));
        this.emit('update');
        return this;
    };
    /**
     * check cache key exist
     * @param key key cache
     * @returns boolean
     */
    CacheFile.prototype.has = function (key) {
        try {
            key = this.resolveKey(key);
            return (Object.hasOwnProperty.call(this.md5Cache, key) && this.md5Cache[key]);
        }
        catch (_) {
            return false;
        }
    };
    /**
     * Get cache by key
     * @param key
     * @param fallback
     * @returns
     */
    CacheFile.prototype.get = function (key, fallback) {
        if (fallback === void 0) { fallback = null; }
        // resolve key hash
        key = this.resolveKey(key);
        // locate key location file
        var locationCache = this.locateKey(key);
        var Get = this.md5Cache[key];
        if (!Get)
            return fallback;
        if ((0, fs_1.existsSync)(locationCache)) {
            try {
                return JSON.parse(String((0, filemanager_1.read)(locationCache, 'utf-8')));
            }
            catch (e) {
                console.log('cannot get cache key', key);
                throw e;
            }
        }
        return fallback;
    };
    /**
     * get all databases
     * @param opt Options
     * @returns object keys and values
     */
    CacheFile.prototype.getAll = function (opt) {
        if (opt === void 0) { opt = exports.defaultResovableValue; }
        opt = Object.assign(exports.defaultResovableValue, opt);
        if (opt.resolveValue) {
            var self_1 = this;
            var result_1 = {};
            Object.keys(this.md5Cache).forEach(function (key) {
                if (self_1.has(key))
                    result_1[key] = self_1.get(key);
            });
            return result_1;
        }
        return this.md5Cache;
    };
    /**
     * get all database values
     * @param opt Options
     * @returns array values
     */
    CacheFile.prototype.getValues = function (opt) {
        if (opt === void 0) { opt = exports.defaultResovableValue; }
        opt = Object.assign(exports.defaultResovableValue, opt);
        if (opt.resolveValue) {
            var result_2 = [];
            var self_2 = this;
            Object.keys(this.md5Cache).forEach(function (key) {
                result_2.push(self_2.get(key));
            });
            if (opt.randomize)
                return (0, array_utils_1.array_shuffle)(result_2);
            if (opt.max) {
                result_2.length = opt.max;
                return result_2.splice(0, opt.max);
            }
            return result_2;
        }
        return Object.values(this.md5Cache);
    };
    /**
     * Check file is changed with md5 algorithm
     * @param path0
     * @returns
     */
    CacheFile.prototype.isFileChanged = function (path0) {
        if (typeof path0 != 'string') {
            //console.log("", typeof path0, path0);
            return true;
        }
        try {
            // get md5 hash from path0
            var pathMd5 = (0, md5_file_1.md5FileSync)(path0);
            // get index hash
            var savedMd5 = this.md5Cache[path0 + '-hash'];
            var result = savedMd5 != pathMd5;
            if (result) {
                // set, if file hash is not found
                this.md5Cache[path0 + '-hash'] = pathMd5;
            }
            return result;
        }
        catch (e) {
            return true;
        }
    };
    /**
     * memoizer persistent file
     * * cached function result for reusable
     * @see {@link memoizer}
     */
    CacheFile.memoizer = new memoize_fs_1.default();
    CacheFile.options = {
        sync: false,
        folder: exports.dbFolder
    };
    return CacheFile;
}(tiny_typed_emitter_1.TypedEmitter));
exports.default = CacheFile;
/**
 * persistent cache
 * @param name cache name
 * @returns
 */
exports.pcache = (0, memoizee_1.default)(function (name) {
    return (0, persistent_cache_1.default)({
        base: (0, filemanager_1.join)(process.cwd(), 'tmp/persistent-cache'),
        name: name,
        duration: 1000 * 3600 * 24 //one day
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS9jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEI7QUFDMUIseUJBQW9DO0FBQ3BDLHNEQUFnQztBQUNoQyxzRUFBK0M7QUFDL0MseURBQWtEO0FBQ2xELCtCQUErQjtBQUUvQiw2Q0FBOEM7QUFDOUMsNkJBQTJCO0FBQzNCLDZDQUFnRjtBQUNoRix1Q0FBOEM7QUFDOUMsNERBQW9DO0FBQ3BDLDBEQUFvQztBQUVwQzs7R0FFRztBQUNVLFFBQUEsUUFBUSxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUEscUJBQU8sRUFBQyxzQkFBUSxDQUFDLENBQUMsQ0FBQztBQWdDckMsUUFBQSxxQkFBcUIsR0FBbUI7SUFDbkQsWUFBWSxFQUFFLElBQUk7SUFDbEIsR0FBRyxFQUFFLElBQUk7SUFDVCxTQUFTLEVBQUUsS0FBSztDQUNqQixDQUFDO0FBTUY7OztHQUdHO0FBQ0g7SUFBdUMsNkJBQTRCO0lBc0JqRSxtQkFBWSxJQUFXLEVBQUUsR0FBYztRQUEzQixxQkFBQSxFQUFBLFdBQVc7UUFBdkIsWUFDRSxpQkFBTyxTQXVCUjtRQTFDTyxXQUFLLEdBQUcsQ0FBQyxDQUFDO1FBV2xCLGNBQVEsR0FBa0IsRUFBRSxDQUFDO1FBa0Q3Qjs7Ozs7V0FLRztRQUNILGNBQVEsR0FBRyxVQUFDLEdBQVcsRUFBRSxLQUFVLElBQUssT0FBQSxLQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQztRQW1CN0Q7Ozs7V0FJRztRQUNILGVBQVMsR0FBRyxVQUFDLEdBQVc7WUFDdEIsT0FBQSxJQUFBLGtCQUFJLEVBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxJQUFBLGNBQUcsRUFBQyxLQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FB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