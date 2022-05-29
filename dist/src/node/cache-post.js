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
    var postCache = new CachePost();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtcG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL2NhY2hlLXBvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUVBQW1EO0FBR25ELDZEQUFzQztBQUN0Qyw2Q0FBOEM7QUFDOUMsaUNBQXdEO0FBQ3hELHVDQUFpQztBQUNqQyw0REFBb0M7QUFDcEMsK0NBQXlDO0FBSXpDO0lBQ0U7SUFBZSxDQUFDO0lBQ2hCLHVCQUFHLEdBQUgsVUFBSSxHQUFXLEVBQUUsS0FBVTtRQUN6QixJQUFBLGNBQU0sRUFBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBQSxjQUFHLEVBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsdUJBQUcsR0FBSCxVQUFPLEdBQVc7UUFDaEIsT0FBTyxJQUFBLGNBQU0sRUFBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBQSxjQUFHLEVBQUMsR0FBRyxDQUFDLENBQU0sQ0FBQztJQUMvQyxDQUFDO0lBRUQsMkJBQU8sR0FBUDtRQUNFLE9BQU8sSUFBQSxjQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELDBCQUFNLEdBQU47UUFDRSxJQUFNLElBQUksR0FBYSxJQUFBLGNBQU0sRUFBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNqRCxPQUFPLElBQUk7YUFDUixHQUFHLENBQUMsVUFBQyxHQUFHO1lBQ1AsSUFBTSxHQUFHLEdBQUcsSUFBQSxjQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ2pELGlDQUFpQztZQUNqQyxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsQ0FBQzthQUNELE1BQU0sQ0FDTCxVQUFDLElBQUksSUFBSyxPQUFBLE9BQU8sSUFBSSxJQUFJLFFBQVEs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