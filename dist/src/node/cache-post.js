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
            .filter(function (post) { return typeof post == 'object' && post !== null; });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtcG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL2NhY2hlLXBvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUVBQW1EO0FBR25ELDZEQUFzQztBQUN0Qyw2Q0FBOEM7QUFDOUMsaUNBQXdEO0FBQ3hELCtCQUFxQztBQUNyQyx1Q0FBaUM7QUFDakMsNERBQW9DO0FBQ3BDLCtDQUF5QztBQUl6QztJQUNFO0lBQWUsQ0FBQztJQUNoQix1QkFBRyxHQUFILFVBQUksR0FBVyxFQUFFLEtBQVU7UUFDekIsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUEsY0FBRyxFQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHVCQUFHLEdBQUgsVUFBTyxHQUFXO1FBQ2hCLE9BQU8sSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUEsY0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFNLENBQUM7SUFDaEQsQ0FBQztJQUVELDJCQUFPLEdBQVA7UUFDRSxPQUFPLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCwwQkFBTSxHQUFOO1FBQ0UsSUFBTSxJQUFJLEdBQWEsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEQsT0FBTyxJQUFJO2FBQ1IsR0FBRyxDQUFDLFVBQUMsR0FBRztZQUNQLElBQU0sR0FBRyxHQUFHLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBVSxHQUFHLENBQUMsQ0FBQztZQUNsRCxpQ0FBaUM7WUFDakMsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUM7YUFDRCxNQUFNLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxPQUFPLElB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