"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.getRandomPosts = exports.getTotalPosts = exports.getAllPosts = exports.getLatestPosts = exports.CachePost = void 0;
var modifyPost_1 = __importDefault(require("../parser/post/modifyPost"));
var _config_1 = __importDefault(require("../types/_config"));
var array_utils_1 = require("./array-utils");
var cache_1 = require("./cache");
var md5_file_1 = require("./md5-file");
var memoize_fs_1 = __importDefault(require("./memoize-fs"));
var string_utils_1 = require("./string-utils");
var CachePost = /** @class */ (function () {
    function CachePost() {
    }
    CachePost.prototype.set = function (key, value) {
        (0, cache_1.pcache)('post').putSync((0, md5_file_1.md5)(key), value);
        return this;
    };
    CachePost.prototype.get = function (key) {
        return (0, cache_1.pcache)('post').getSync((0, md5_file_1.md5)(key));
    };
    CachePost.prototype.getKeys = function () {
        return (0, cache_1.pcache)('post').keysSync();
    };
    CachePost.prototype.getAll = function () {
        var keys = (0, cache_1.pcache)('post').keysSync();
        return keys
            .map(function (key) {
            var get = (0, cache_1.pcache)('post').getSync(key);
            //console.log('get', typeof get);
            return get;
        })
            .filter(function (post) { return typeof post == 'object' && post !== null && post !== undefined; });
    };
    /**
     * get total posts
     * @returns
     */
    CachePost.prototype.getTotal = function () {
        return (0, cache_1.pcache)('post').keysSync().length;
    };
    return CachePost;
}());
exports.CachePost = CachePost;
var postCache = new CachePost();
/**
 * fix post
 * @param post
 * @returns
 */
function fixPost(post) {
    if (typeof post.metadata == 'object' &&
        typeof post.metadata.url == 'string') {
        var url = new URL(post.metadata.url);
        if ((0, string_utils_1.isMatch)(url.pathname, /.md$/)) {
            url.pathname = url.pathname.replace(/.md$/, '.html');
        }
        post.metadata.url = String(url);
    }
    return post;
}
/**
 * order array
 * @param array
 * @param by
 * @returns
 */
function order_by(array, by) {
    if (Array.isArray(array)) {
        return array
            .filter(function (post) { return post && typeof post.metadata == 'object'; })
            .sort(function (a, b) {
            var modby = by.replace('-', '');
            /*try {
    
          } catch (error) {
            if (error instanceof Error) console.log('cache-post.ts#order_by', error.message);
          }*/
            var c = new Date(a.metadata[modby]);
            var d = new Date(b.metadata[modby]);
            if (by.startsWith('-')) {
                // descending
                if (c < d)
                    return 1;
                if (c > d)
                    return -1;
            }
            else {
                if (c > d)
                    return 1;
                if (c < d)
                    return -1;
            }
            return 0;
        });
    }
    return array;
}
/**
 * get latest posts
 * @param by order descending by `date` or default (`index_generator.order_by` in `_config.yml`)
 * @param max max result
 * @returns array of {@link postResult}
 */
function getLatestPosts(by, max) {
    if (by === void 0) { by = '-updated'; }
    if (max === void 0) { max = 5; }
    var posts = getAllPosts();
    var reorderPosts = order_by(posts, by); //removeEmpties(order_by(posts, by));
    //console.log('getLatestPosts', reorderPosts.length);
    return (reorderPosts
        // dont index redirected post
        .filter(function (post) { return !post.metadata.redirect; })
        .splice(0, max)
        .map(function (post) { return fixPost(post); })
        .map(function (post) {
        return Object.assign(post, post.metadata);
    }));
}
exports.getLatestPosts = getLatestPosts;
/**
 * get all posts
 * @returns array of posts {@link CacheFile.getValues}
 */
function getAllPosts() {
    if (postCache.getTotal() < 1)
        return [];
    return order_by(postCache.getAll(), _config_1.default.index_generator.order_by)
        .filter(function (post) { return post && post.metadata.type == 'post'; })
        .map(function (post) { return (0, modifyPost_1.default)(post); })
        .map(function (post) { return fixPost(post); })
        .map(function (post) {
        if (typeof post == 'string')
            return JSON.parse(post);
        return post;
    });
}
exports.getAllPosts = getAllPosts;
/**
 * get total posts (no page)
 * @returns
 */
function getTotalPosts() {
    return getAllPosts().length;
}
exports.getTotalPosts = getTotalPosts;
var randoms = {};
/**
 * get random posts
 * @param max max results
 * @param identifier cached result
 * @returns
 */
function getRandomPosts(max, identifier) {
    if (max === void 0) { max = 5; }
    if (identifier === void 0) { identifier = 'default'; }
    var result = randoms[identifier];
    if (Array.isArray(result) && result.length > 0)
        return result;
    cache_1.defaultResovableValue.randomize = true;
    cache_1.defaultResovableValue.max = max;
    var get = (function () {
        var fetchAll = function () {
            return (0, array_utils_1.removeEmpties)(getAllPosts())
                .splice(0, max)
                .map(function (post) { return fixPost(post); })
                .map(function (post) {
                return Object.assign(post, post.metadata);
            });
        };
        if (_config_1.default.generator.cache) {
            return new memoize_fs_1.default().fn(function () {
                return fetchAll();
            });
        }
        else {
            return fetchAll;
        }
    })();
    randoms[identifier] = get();
    return randoms[identifier];
}
exports.getRandomPosts = getRandomPosts;
exports.Post = CachePost;
exports.default = CachePost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtcG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL2NhY2hlLXBvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUVBQW1EO0FBR25ELDZEQUFzQztBQUN0Qyw2Q0FBOEM7QUFDOUMsaUNBQXdEO0FBQ3hELHVDQUFpQztBQUNqQyw0REFBb0M7QUFDcEMsK0NBQXlDO0FBSXpDO0lBQUE7SUFrQ0EsQ0FBQztJQWpDQyx1QkFBRyxHQUFILFVBQUksR0FBVyxFQUFFLEtBQVU7UUFDekIsSUFBQSxjQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUEsY0FBRyxFQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHVCQUFHLEdBQUgsVUFBTyxHQUFXO1FBQ2hCLE9BQU8sSUFBQSxjQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUEsY0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFNLENBQUM7SUFDL0MsQ0FBQztJQUVELDJCQUFPLEdBQVA7UUFDRSxPQUFPLElBQUEsY0FBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCwwQkFBTSxHQUFOO1FBQ0UsSUFBTSxJQUFJLEdBQWEsSUFBQSxjQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakQsT0FBTyxJQUFJO2FBQ1IsR0FBRyxDQUFDLFVBQUMsR0FBRztZQUNQLElBQU0sR0FBRyxHQUFHLElBQUEsY0FBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBVSxHQUFHLENBQUMsQ0FBQztZQUNqRCxpQ0FBaUM7WUFDakMsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUM7YUFDRCxNQUFNLENBQ0wsVUFBQyxJQUFJLElBQUssT0FBQSxPQUFPLElBQUksSUFBSSxRQUFR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