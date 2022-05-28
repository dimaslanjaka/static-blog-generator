"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateMapper = exports.post_chunks = exports.simplifyDump = exports.postChunksMapper = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
var moment_1 = __importDefault(require("moment"));
var array_utils_1 = require("../../node/array-utils");
var cache_post_1 = require("../../node/cache-post");
var excerpt_1 = require("../../renderer/ejs/helper/excerpt");
var thumbnail_1 = require("../../renderer/ejs/helper/thumbnail");
var _config_1 = __importDefault(require("../../types/_config"));
/**
 * Transform post object
 * * merge post metadata property ({@link postMap.metadata}) to root property
 * @returns
 */
function postMapper(post) {
    var assigned = post;
    if (typeof post == 'object' && typeof post.metadata == 'object') {
        post.metadata.date =
            typeof post.metadata.date == 'string'
                ? new dateMapper(post.metadata.date)
                : post.metadata.date;
        assigned = Object.assign(post, post.metadata);
    }
    return assigned;
}
exports.default = postMapper;
/**
 * transform array into an mapped chunks
 * @param chunks
 * @returns
 */
function postChunksMapper(chunks) {
    var defaultMap = {
        page_next: null,
        page_now: null,
        page_next_url: null,
        page_prev: null,
        page_prev_url: null
    };
    chunks.map(function (arr_chunk, i) {
        if (Array.isArray(arr_chunk)) {
            var ret = arr_chunk.map(function (post) {
                post.page_now = i;
                post.page_next = i + 1;
                post.page_prev = i - 1;
                if (post.page_prev === -1)
                    post.page_prev = null;
                post.total = chunks.length;
                if (Array.isArray(chunks[post.page_prev])) {
                    post.prev = chunks[post.page_prev];
                }
                if (Array.isArray(chunks[post.page_next])) {
                    post.next = chunks[post.page_next];
                }
                return Object.assign(defaultMap, post);
            });
            return ret;
        }
        return arr_chunk;
    });
    return chunks;
}
exports.postChunksMapper = postChunksMapper;
/**
 * simplified dump
 * @param post
 * @returns
 */
function simplifyDump(post, except) {
    if (except === void 0) { except = []; }
    if (Array.isArray(post))
        return post.map(function (o) { return simplifyDump(o, except); });
    if (typeof post == 'object' && post !== null) {
        if ('posts' in post) {
            var archivePosts = post['posts'];
            if (Array.isArray(archivePosts)) {
                post['posts'] = archivePosts.map(function (o) { return simplifyDump(o, except); });
            }
        }
        var keyToRemove = [
            'config',
            'body',
            'prev',
            'next',
            'content',
            'body',
            'sitedata',
            'author'
        ].filter(function (el) {
            if (Array.isArray(except)) {
                return except.indexOf(el) < 0;
            }
            else {
                return el === except;
            }
        });
        for (var key in post) {
            if (Object.prototype.hasOwnProperty.call(post, key)) {
                if (keyToRemove.includes(key)) {
                    if (post[key])
                        post[key] = "[".concat(typeof post[key], "]");
                }
            }
        }
        for (var key in post['metadata']) {
            if (Object.prototype.hasOwnProperty.call(post['metadata'], key)) {
                if (keyToRemove.includes(key)) {
                    if (post['metadata'][key])
                        post['metadata'][key] =
                            '[' + typeof post['metadata'][key] + ']';
                }
            }
        }
    }
    return post;
}
exports.simplifyDump = simplifyDump;
/**
 * split posts array to chunks
 * @param arr
 * @returns
 */
function post_chunks(arr) {
    var posts = (Array.isArray(arr) ? arr : (0, cache_post_1.getAllPosts)())
        .filter(function (item) {
        if (!item)
            return false;
        if (!item.metadata)
            return false;
        return true;
    })
        .map(postMapper);
    //console.log('post chunk total', posts.length);
    //.map((post) => Object.assign(post, post.metadata));
    /**
     * split posts to chunks divided by {@link config.index_generator.per_page}
     */
    var chunk = postChunksMapper((0, array_utils_1.array_split_chunks)(posts, _config_1.default.index_generator.per_page));
    var sitedata = posts.map(function (post) {
        var data = {
            title: post.metadata.title,
            thumbnail: (0, thumbnail_1.thumbnail)(post.metadata),
            url: post.metadata.url,
            excerpt: (0, excerpt_1.excerpt)(post.metadata)
        };
        return data;
    });
    return {
        /** all posts */
        posts: posts,
        /** all posts chunks */
        chunk: chunk,
        /** all posts infinite scroll sitedata */
        sitedata: sitedata
    };
}
exports.post_chunks = post_chunks;
/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
var dateMapper = /** @class */ (function () {
    function dateMapper(date) {
        var _this = this;
        this.format = function (pattern) { return _this.data.format(pattern); };
        this.year = function () { return _this.data.format('YYYY'); };
        this.toString = function () { return _this.data.format('YYYY-MM-DDTHH:mm:ssZ'); };
        if (typeof date == 'string') {
            this.data = (0, moment_1.default)(date);
        }
    }
    return dateMapper;
}());
exports.dateMapper = dateMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdE1hcHBlci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9wYXJzZXIvcG9zdC9wb3N0TWFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCxrREFBNEI7QUFDNUIsc0RBQTREO0FBRTVELG9EQUFvRDtBQUNwRCw2REFBNEQ7QUFDNUQsaUVBQWdFO0FBQ2hFLGdFQUF5QztBQW9FekM7Ozs7R0FJRztBQUNILFNBQXdCLFVBQVUsQ0FBQyxJQUFhO0lBQzlDLElBQUksUUFBUSxHQUFrQyxJQUFJLENBQUM7SUFDbkQsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsRUFBRTtRQUMvRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRO2dCQUNuQyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9DO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQVZELDZCQVVDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLGdCQUFnQixDQUFvQixNQUFTO0lBQzNELElBQU0sVUFBVSxHQUFlO1FBQzdCLFNBQVMsRUFBRSxJQUFJO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxhQUFhLEVBQUUsSUFBSTtRQUNuQixTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO0tBQ3BCLENBQUM7SUFDRixNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsU0FBUyxFQUFFLENBQUM7UUFDdEIsSUFB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