"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.getRandomPosts = exports.getTotalPosts = exports.getAllPosts = exports.getLatestPosts = exports.orderPostBy = exports.CachePost = void 0;
var modifyPost_1 = __importDefault(require("../parser/post/modifyPost"));
var _config_1 = __importDefault(require("../types/_config"));
var array_utils_1 = require("./array-utils");
var cache_1 = require("./cache");
var JSON_1 = require("./JSON");
var md5_file_1 = require("./md5-file");
var memoize_fs_1 = __importDefault(require("./memoize-fs"));
var string_utils_1 = require("./string-utils");
var CachePost = /** @class */ (function () {
    function CachePost() {
    }
    CachePost.prototype.set = function (key, value) {
        (0, cache_1.pcache)('posts').putSync((0, md5_file_1.md5)(key), value);
        return this;
    };
    CachePost.prototype.get = function (key) {
        return (0, cache_1.pcache)('posts').getSync((0, md5_file_1.md5)(key));
    };
    CachePost.prototype.getKeys = function () {
        return (0, cache_1.pcache)('posts').keysSync();
    };
    CachePost.prototype.getAll = function () {
        var keys = (0, cache_1.pcache)('posts').keysSync();
        return keys
            .map(function (key) {
            var get = (0, cache_1.pcache)('posts').getSync(key);
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
        return (0, cache_1.pcache)('posts').keysSync().length;
    };
    return CachePost;
}());
exports.CachePost = CachePost;
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
function orderPostBy(array, by) {
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
exports.orderPostBy = orderPostBy;
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
    var reorderPosts = orderPostBy(posts, by); //removeEmpties(order_by(posts, by));
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
 * get sorted all posts
 * * sort options {@link config.index_generator.order_by}
 * @returns sorted array of posts {@link CachePost.getAll}
 */
function getAllPosts() {
    var postCache = new CachePost();
    if (postCache.getTotal() < 1)
        return [];
    return orderPostBy(postCache.getAll(), _config_1.default.index_generator.order_by)
        .filter(function (post) { return post && post.metadata.type == 'post'; })
        .map(function (post) { return (0, modifyPost_1.default)(post); })
        .map(function (post) { return fixPost(post); })
        .map(function (post) {
        if (typeof post == 'string')
            return (0, JSON_1.json_decode)(post);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtcG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL2NhY2hlLXBvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUVBQW1EO0FBR25ELDZEQUFzQztBQUN0Qyw2Q0FBOEM7QUFDOUMsaUNBQXdEO0FBQ3hELCtCQUFxQztBQUNyQyx1Q0FBaUM7QUFDakMsNERBQW9DO0FBQ3BDLCtDQUF5QztBQUl6QztJQUNFO0lBQWUsQ0FBQztJQUNoQix1QkFBRyxHQUFILFVBQUksR0FBVyxFQUFFLEtBQVU7UUFDekIsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUEsY0FBRyxFQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHVCQUFHLEdBQUgsVUFBTyxHQUFXO1FBQ2hCLE9BQU8sSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUEsY0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFNLENBQUM7SUFDaEQsQ0FBQztJQUVELDJCQUFPLEdBQVA7UUFDRSxPQUFPLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCwwQkFBTSxHQUFOO1FBQ0UsSUFBTSxJQUFJLEdBQWEsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsT0FBTyxJQUFJO2FBQ1IsR0FBRyxDQUFDLFVBQUMsR0FBRztZQUNQLElBQU0sR0FBRyxHQUFHLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBVSxHQUFHLENBQUMsQ0FBQztZQUNsRCxpQ0FBaUM7WUFDakMsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUM7YUFDRCxNQUFNLENBQ0wsVUFBQyxJQUFJLElBQUssT0FBQSxPQUFPLElB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