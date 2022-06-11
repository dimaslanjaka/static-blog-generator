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
        page_prev_url: null,
        title: '',
        description: ''
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
            'author',
            'tags',
            'category'
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
                        post[key] = ("[".concat(Array.isArray(post[key]) ? 'array' : typeof post[key], "]"));
                }
            }
        }
        if ('metadata' in post)
            for (var key in post['metadata']) {
                if (Object.prototype.hasOwnProperty.call(post['metadata'], key)) {
                    if (keyToRemove.includes(key)) {
                        if (post['metadata'][key])
                            post['metadata'][key] = Array.isArray(post['metadata'][key])
                                ? '[array]'
                                : '[' + typeof post['metadata'][key] + ']';
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
        /** all posts chunks (used for pagination) */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdE1hcHBlci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9wYXJzZXIvcG9zdC9wb3N0TWFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCxrREFBNEI7QUFDNUIsc0RBQTREO0FBRTVELG9EQUFvRDtBQUNwRCw2REFBNEQ7QUFDNUQsaUVBQWdFO0FBQ2hFLGdFQUF5QztBQTBFekM7Ozs7R0FJRztBQUNILFNBQXdCLFVBQVUsQ0FBdUIsSUFBTztJQUM5RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDcEIsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsRUFBRTtRQUMvRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRO2dCQUNuQyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQy9DO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQVZELDZCQVVDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLGdCQUFnQixDQUEyQixNQUFTO0lBQ2xFLElBQU0sVUFBVSxHQUFlO1FBQzdCLFNBQVMsRUFBRSxJQUFJO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxhQUFhLEVBQUUsSUFBSTtRQUNuQixTQUFTLEVBQUUsSUFBSTtRQUNmLGFBQWEsRUFBRSxJQUFJO1FBQ25CLEtBQUssRUFBRSxFQUFFO1FBQ1QsV0FBVyxFQUFFLEVBQUU7S0FDaEIsQ0FBQztJQUNGLE1BQU0sQ0FB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