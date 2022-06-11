"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomepageProperties = exports.getCategoryProperties = exports.getArchiveProperties = void 0;
var upath_1 = require("upath");
var util_1 = require("util");
var array_wrapper_1 = require("../../../node/array-wrapper");
var cache_post_1 = require("../../../node/cache-post");
var filemanager_1 = require("../../../node/filemanager");
var postMapper_1 = require("../../../parser/post/postMapper");
var date_1 = require("../../../renderer/ejs/helper/date");
var excerpt_1 = require("../../../renderer/ejs/helper/excerpt");
var _config_1 = __importStar(require("../../../types/_config"));
/**
 * get homepage archive properties
 * @returns
 */
function getArchiveProperties(allPostChunks) {
    // dump
    if (_config_1.isDev)
        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/getArchiveProperties/all_posts_chunks.log'), (0, util_1.inspect)(allPostChunks, true, 3));
    var properties = [];
    for (var index = 0; index < allPostChunks.chunk.length; index++) {
        /** all posts of this page */
        var posts = allPostChunks.chunk[index];
        /** setup page.post.each */
        var mapped = (0, array_wrapper_1.array_wrap)(posts);
        /** latest post date of this page */
        var latestUpdated = (0, date_1.getLatestDateArray)(mapped.map(function (post) {
            return typeof post.metadata.updated == 'string'
                ? post.metadata.updated
                : post.metadata.updated.toString();
        }));
        var latestPublished = (0, date_1.getLatestDateArray)(mapped.map(function (post) {
            return typeof post.metadata.date == 'string'
                ? post.metadata.date
                : post.metadata.date.toString();
        }));
        /** setup page metadata for renderer */
        var property = {
            metadata: {
                title: 'Archive Page ' + (index + 1),
                description: (0, excerpt_1.excerpt)(_config_1.default),
                date: latestPublished,
                updated: latestUpdated,
                type: 'archive'
            },
            posts: mapped,
            total: mapped.length,
            page_now: index,
            page_now_url: _config_1.default.url + '/page/' + index,
            next: allPostChunks.chunk[index + 1] || null,
            page_next: index + 1,
            page_next_url: Array.isArray(allPostChunks.chunk[index + 1])
                ? _config_1.default.url + '/page/' + (index + 1)
                : null,
            prev: allPostChunks.chunk[index - 1] || null,
            page_prev: index - 1 <= 0 ? null : index - 1,
            page_prev_url: Array.isArray(allPostChunks.chunk[index - 1])
                ? '/page/' + (index - 1)
                : '/page/'
        };
        properties.push(property);
    }
    if (_config_1.isDev)
        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/getArchiveProperties/archives.log'), (0, util_1.inspect)(properties, true, 3));
    return properties;
}
exports.getArchiveProperties = getArchiveProperties;
function getCategoryProperties() {
    var categories = {};
    // iterate all posts to get categories
    var allPosts = (0, cache_post_1.getAllPosts)();
    var _loop_1 = function (i) {
        var post = allPosts[i];
        if ('metadata' in post)
            if ('category' in post.metadata)
                post.metadata.category.flatMap(function (labelname) {
                    if (!categories[labelname])
                        categories[labelname] = [];
                    categories[labelname].push(post);
                });
    };
    for (var i = 0; i < allPosts.length; i++) {
        _loop_1(i);
    }
    for (var catName in categories) {
        if (Object.prototype.hasOwnProperty.call(categories, catName)) {
            // sort category posts
            var sortedPosts = (0, cache_post_1.orderPostBy)(categories[catName], _config_1.default.index_generator.order_by);
            // transform chunk category posts
            var parseChunk = (0, postMapper_1.post_chunks)(sortedPosts);
            var getProperies = getArchiveProperties(parseChunk);
            categories[catName] = getProperies;
            if (_config_1.isDev)
                (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/getArchiveProperties/categories', catName + '.log'), (0, util_1.inspect)(getProperies, true, 3));
        }
    }
    if (_config_1.isDev)
        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/getArchiveProperties/categories/index.log'), (0, util_1.inspect)(categories, true, 3));
    return categories;
}
exports.getCategoryProperties = getCategoryProperties;
function getHomepageProperties() {
    var allPosts = (0, cache_post_1.getAllPosts)();
    return getArchiveProperties((0, postMapper_1.post_chunks)(allPosts));
}
exports.getHomepageProperties = getHomepageProperties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QXJjaGl2ZVByb3BlcnRpZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS9nZXRBcmNoaXZlUHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUE2QjtBQUM3Qiw2QkFBK0I7QUFDL0IsNkRBQXlEO0FBQ3pELHVEQUFvRTtBQUNwRSx5REFBa0Q7QUFDbEQsOERBQTBFO0FBQzFFLDBEQUF1RTtBQUN2RSxnRUFBK0Q7QUFDL0QsZ0VBQXVEO0FBRXZEOzs7R0FHRztBQUNILFNBQWdCLG9CQUFvQixDQUNsQyxhQUE2QztJQUU3QyxPQUFPO0lBQ1AsSUFBSSxlQUFLO1FBQ1AsSUFBQSxtQkFBSyxFQUNILElBQUEsWUFBSSxFQUFDLFNBQVMsRUFBRSwrQ0FBK0MsQ0FBQyxFQUNoRSxJQUFBLGNBQU8sRUFBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUNoQyxDQUFDO0lBRUosSUFBTSxVQUFVLEdBQWlCLEVBQUUsQ0FBQztJQUVwQyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDL0QsNkJBQTZCO1FBQzdCLElBQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsMkJBQTJCO1FBQzNCLElBQU0sTUFBTSxHQUFHLElBQUEsMEJBQVUsRUFBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxvQ0FBb0M7UUFDcEMsSUFBTSxhQUFhLEdBQUcsSUFBQSx5QkFBa0IsRUFDdEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUk7WUFDZCxPQUFBLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksUUFBUTtnQkFDdEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxR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