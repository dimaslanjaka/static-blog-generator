'use strict';

var fs = require('fs-extra');
var path = require('upath');
var JSON$1 = require('./JSON.cjs');
require('path');
require('bluebird');
require('minimatch');
require('./filemanager/case-path.cjs');
var normalizePath = require('./filemanager/normalizePath.cjs');
var writefile = require('./filemanager/writefile.cjs');

class persistentCache {
    base;
    name;
    duration;
    memory;
    persist;
    memoryCache = {};
    constructor(options = {}) {
        this.base =
            options.base ||
                normalizePath.normalizePath((require.main ? path.dirname(require.main.filename) : undefined) || process.cwd(), 'tmp');
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
    put(key, data, cb) {
        const put = this.putSync(key, data);
        if (put === true) {
            return safeCb(cb)(null);
        }
        else {
            safeCb(cb)(put);
        }
    }
    /**
     * add cache sync
     * @param key
     * @param data
     * @returns boolean=success, any=error
     */
    putSync(key, data) {
        const entry = this.buildCacheEntry(data);
        if (this.persist) {
            // save in file
            try {
                writefile.writefile(this.buildFilePath(key), JSON$1.jsonStringifyWithCircularRefs(entry));
            }
            catch (e) {
                return e;
            }
        }
        if (this.memory) {
            // save in memory only
            entry.data = JSON$1.jsonStringifyWithCircularRefs(entry.data);
            this.memoryCache[key] = entry;
        }
        return true;
    }
    setSync = this.putSync;
    /**
     * add cache async
     * @param key
     * @param data
     * @returns
     */
    set(key, data) {
        return new Promise((resolve, reject) => {
            this.put(key, data, function (e) {
                if (!e) {
                    resolve(true);
                }
                else {
                    reject(e);
                }
            });
        });
    }
    /**
     * get cache by key synchronously
     * @param name
     * @param fallback
     * @returns
     */
    getSync(name, fallback) {
        if (this.memory && !!this.memoryCache[name]) {
            const entry = this.memoryCache[name];
            if (entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                // cache expired
                return fallback;
            }
            return JSON.parse(entry.data);
        }
        let data;
        try {
            data = JSON.parse(fs.readFileSync(this.buildFilePath(name), 'utf8'));
        }
        catch (_e) {
            return fallback;
        }
        if (data.cacheUntil && new Date().getTime() > data.cacheUntil)
            return fallback;
        return data.data;
    }
    get(name, fallback) {
        if (typeof fallback !== 'function') {
            return new Promise((resolve) => {
                resolve(this.getSync(name, fallback));
            });
        }
        else {
            if (this.memory && !!this.memoryCache[name]) {
                let entry = this.memoryCache[name];
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
            fs.readFile(this.buildFilePath(name), 'utf8', function (err, content) {
                if (err != null) {
                    return safeCb(fallback)(null, undefined);
                }
                let entry;
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
    }
    /**
     * delete cache
     * @param name cache key
     * @param cb
     */
    deleteEntry(name, cb) {
        if (this.memory) {
            delete this.memoryCache[name];
            if (!this.persist)
                safeCb(cb)(null);
        }
        fs.unlink(this.buildFilePath(name), cb);
    }
    /**
     * delete cache sync
     * @param name cache key
     * @returns
     */
    deleteEntrySync(name) {
        if (this.memory) {
            delete this.memoryCache[name];
            if (!this.persist)
                return;
        }
        fs.unlinkSync(this.buildFilePath(name));
    }
    getCacheDir() {
        return path.normalize(this.base + '/' + (this.name || 'cache'));
    }
    /**
     * remove current cache directory
     * @param cb
     * @returns
     */
    unlink(cb) {
        if (this.persist) {
            if (typeof cb !== 'function') {
                return fs.rmSync(this.getCacheDir(), { recursive: true, force: true });
            }
            else {
                return fs.rm(this.getCacheDir(), { recursive: true, force: true }, safeCb(cb));
            }
        }
        safeCb(cb)(null);
    }
    transformFileNameToKey(fileName) {
        return fileName.slice(0, -5);
    }
    /**
     * get all cache keys
     * @param cb
     * @returns
     */
    keys(cb) {
        const self = this;
        cb = safeCb(cb);
        if (this.memory && !this.persist)
            return cb(null, Object.keys(this.memoryCache));
        fs.readdir(this.getCacheDir(), function (err, files) {
            return err ? cb(err) : cb(err, files.map(self.transformFileNameToKey));
        });
    }
    /**
     * get cache keys sync
     * @returns
     */
    keysSync() {
        const self = this;
        if (this.memory && !this.persist)
            return Object.keys(this.memoryCache);
        if (fs.existsSync(this.getCacheDir())) {
            return fs.readdirSync(this.getCacheDir()).map(self.transformFileNameToKey);
        }
        else {
            return [];
        }
    }
    /**
     * get all values
     * @returns
     */
    valuesSync() {
        return this.keysSync().map((key) => {
            return this.getSync(key);
        });
    }
    buildFilePath(name) {
        return path.normalize(this.getCacheDir() + '/' + name + '.json');
    }
    buildCacheEntry(data) {
        const cacheInfinitely = !(typeof this.duration === 'number');
        return {
            cacheUntil: !cacheInfinitely ? new Date().getTime() + this.duration : undefined,
            data: data
        };
    }
}
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

exports.persistentCache = persistentCache;
exports.safeCb = safeCb;
