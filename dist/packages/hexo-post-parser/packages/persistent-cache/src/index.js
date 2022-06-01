"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var mkdirp_no_bin_1 = __importDefault(require("mkdirp-no-bin"));
var rmdir_1 = __importDefault(require("rmdir"));
var upath_1 = __importDefault(require("upath"));
function exists(dir) {
    try {
        fs_1.default.accessSync(dir);
    }
    catch (err) {
        return false;
    }
    return true;
}
function safeCb(cb) {
    if (typeof cb === 'function')
        return cb;
    return function () {
        //
    };
}
/**
 * write to file recursive
 * @param {string} filepath
 * @param {any} content
 */
function writeFile(filepath, content) {
    if (!fs_1.default.existsSync(upath_1.default.dirname(filepath))) {
        fs_1.default.mkdirSync(upath_1.default.dirname(filepath), { recursive: true });
    }
    fs_1.default.writeFileSync(filepath, content);
}
/**
 * Persistent Cache
 * @param {import('./index').Opt} options
 * @returns
 */
function cache(options) {
    options = options || {};
    var base = upath_1.default.normalize((options.base ||
        (require.main ? upath_1.default.dirname(require.main.filename) : undefined) ||
        process.cwd()) + '/cache');
    if (!fs_1.default.existsSync(upath_1.default.dirname(base)))
        fs_1.default.mkdirSync(upath_1.default.dirname(base), { recursive: true });
    var cacheDir = upath_1.default.normalize(base + '/' + (options.name || 'cache'));
    var cacheInfinitely = !(typeof options.duration === 'number');
    var cacheDuration = options.duration;
    var ram = typeof options.memory == 'boolean' ? options.memory : true;
    var persist = typeof options.persist == 'boolean' ? options.persist : true;
    var memoryCache = {};
    if (persist && !exists(cacheDir))
        mkdirp_no_bin_1.default.sync(cacheDir);
    function buildFilePath(name) {
        return upath_1.default.normalize(cacheDir + '/' + name + '.json');
    }
    function buildCacheEntry(data) {
        return {
            cacheUntil: !cacheInfinitely
                ? new Date().getTime() + cacheDuration
                : undefined,
            data: data
        };
    }
    function put(name, data, cb) {
        var entry = buildCacheEntry(data);
        if (persist)
            fs_1.default.writeFile(buildFilePath(name), JSON.stringify(entry), cb);
        if (ram) {
            entry.data = JSON.stringify(entry.data);
            memoryCache[name] = entry;
            if (!persist)
                return safeCb(cb)(null);
        }
    }
    function putSync(name, data) {
        var entry = buildCacheEntry(data);
        if (persist)
            writeFile(buildFilePath(name), JSON.stringify(entry));
        if (ram) {
            memoryCache[name] = entry;
            memoryCache[name].data = JSON.stringify(memoryCache[name].data);
        }
    }
    function get(name, cb) {
        if (ram && !!memoryCache[name]) {
            var entry = memoryCache[name];
            if (!!entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                return safeCb(cb)(null, undefined);
            }
            try {
                entry = JSON.parse(entry.data);
            }
            catch (e) {
                return safeCb(cb)(e);
            }
            return safeCb(cb)(null, entry);
        }
        fs_1.default.readFile(buildFilePath(name), 'utf8', onFileRead);
        function onFileRead(err, content) {
            if (err != null) {
                return safeCb(cb)(null, undefined);
            }
            var entry;
            try {
                entry = JSON.parse(content);
            }
            catch (e) {
                return safeCb(cb)(e);
            }
            if (!!entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                return safeCb(cb)(null, undefined);
            }
            return safeCb(cb)(null, entry.data);
        }
    }
    function getSync(name) {
        if (ram && !!memoryCache[name]) {
            var entry = memoryCache[name];
            if (entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
                return undefined;
            }
            return JSON.parse(entry.data);
        }
        var data;
        try {
            data = JSON.parse(fs_1.default.readFileSync(buildFilePath(name), 'utf8'));
        }
        catch (e) {
            return undefined;
        }
        if (data.cacheUntil && new Date().getTime() > data.cacheUntil)
            return undefined;
        return data.data;
    }
    function deleteEntry(name, cb) {
        if (ram) {
            delete memoryCache[name];
            if (!persist)
                safeCb(cb)(null);
        }
        fs_1.default.unlink(buildFilePath(name), cb);
    }
    function deleteEntrySync(name) {
        if (ram) {
            delete memoryCache[name];
            if (!persist)
                return;
        }
        fs_1.default.unlinkSync(buildFilePath(name));
    }
    function unlink(cb) {
        if (persist)
            return (0, rmdir_1.default)(cacheDir, safeCb(cb));
        safeCb(cb)(null);
    }
    function transformFileNameToKey(fileName) {
        return fileName.slice(0, -5);
    }
    function resolveDir(dirPath) {
        if (!fs_1.default.existsSync(dirPath))
            fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
    function keys(cb) {
        cb = safeCb(cb);
        if (ram && !persist)
            return cb(null, Object.keys(memoryCache));
        fs_1.default.readdir(cacheDir, onDirRead);
        function onDirRead(err, files) {
            return err ? cb(err) : cb(err, files.map(transformFileNameToKey));
        }
    }
    function keysSync() {
        if (ram && !persist)
            return Object.keys(memoryCache);
        resolveDir(cacheDir);
        return fs_1.default.readdirSync(cacheDir).map(transformFileNameToKey);
    }
    function valuesSync() {
        return keysSync().map(function (key) {
            return get(key);
        });
    }
    return {
        put: put,
        set: put,
        get: get,
        delete: deleteEntry,
        putSync: putSync,
        setSync: putSync,
        getSync: getSync,
        deleteSync: deleteEntrySync,
        keys: keys,
        keysSync: keysSync,
        valuesSync: valuesSync,
        unlink: unlink
    };
}
exports.default = cache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJwYWNrYWdlcy9oZXhvLXBvc3QtcGFyc2VyL3BhY2thZ2VzL3BlcnNpc3RlbnQtY2FjaGUvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMENBQW9CO0FBQ3BCLGdFQUFtQztBQUNuQyxnREFBMEI7QUFDMUIsZ0RBQXlCO0FBRXpCLFNBQVMsTUFBTSxDQUFDLEdBQWdCO0lBQzlCLElBQUk7UUFDRixZQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBUyxNQUFNLENBQUMsRUFBdUM7SUFDckQsSUFBSSxPQUFPLEVBQUUsS0FBSyxVQUFVO1FBQUUsT0FBTyxFQUFFLENBQUM7SUFFeEMsT0FBTztRQUNMLEVBQUU7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPO0lBQ2xDLElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLGVBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtRQUMxQyxZQUFFLENBQUMsU0FBUyxDQUFDLGVBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUMzRDtJQUNELFlBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxLQUFLLENBQUMsT0FBTztJQUNwQixPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUV4QixJQUFNLElBQUksR0FBRyxlQUFJLENBQUMsU0FBUyxDQUN6QixDQUFD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