"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyPost = void 0;
var node_html_parser_1 = require("node-html-parser");
var utils_1 = require("../../gulp/utils");
var array_utils_1 = require("../../node/array-utils");
var cache_1 = require("../../node/cache");
var JSON_1 = require("../../node/JSON");
var md5_file_1 = require("../../node/md5-file");
var string_utils_1 = require("../../node/string-utils");
var date_1 = require("../../renderer/ejs/helper/date");
var _config_1 = __importDefault(require("../../types/_config"));
var toHtml_1 = require("../toHtml");
var modCache = (0, cache_1.pcache)('modify');
/*interface GroupLabel {
  [key: string]: ReturnType<typeof parsePost>[];
}
const postCats: GroupLabel = {};
const postTags: GroupLabel = {};
const cacheTags = new CacheFile('postTags');
const cacheCats = new CacheFile('postCats');*/
var _g = (typeof window != 'undefined' ? window : global) /* node */;
function modifyPost(data, options) {
    if (options === void 0) { options = {
        merge: false,
        cache: _config_1.default.generator.cache
    }; }
    if (data === null || typeof data === 'undefined' || typeof data !== 'object')
        return null;
    if (Array.isArray(data))
        throw new Error('Cannot use array on modifyPost');
    var title, date, updated, type;
    [data.metadata, data].forEach(function (meta) {
        if (typeof meta === 'undefined' || meta === null)
            return;
        if ('type' in meta)
            type = meta.type;
        if ('title' in meta)
            title = meta.title;
        if ('date' in meta)
            date = String(meta.date);
        if ('updated' in meta)
            updated = String(meta.updated);
    });
    var useCache = options.cache;
    var cacheKey = (0, md5_file_1.md5)(title + date + updated + type);
    if (useCache) {
        var get = modCache.getSync(cacheKey);
        if (typeof get == 'string')
            return JSON.parse(get);
        if (get)
            return get;
    }
    if ('metadata' in data) {
        // @declare merge metadata with default object
        data.metadata = Object.assign({
            tags: [],
            category: [],
            title: '',
            description: '',
            date: (0, date_1.modMoment)(),
            updated: (0, date_1.modMoment)()
        }, data.metadata);
        // @todo setup empty categories when not set
        if ('category' in data.metadata) {
            if (!Array.isArray(data.metadata.category)) {
                data.metadata.category = [_config_1.default.default_category].filter(function (s) { return s; });
            }
        }
        // @todo setup empty tags when not set
        if ('tags' in data.metadata) {
            if (!Array.isArray(data.metadata.tags)) {
                data.metadata.tags = [_config_1.default.default_tag].filter(function (s) { return s; });
            }
        }
        // @declare tag mapper
        var postLowerTags = data.metadata.tags.map(function (tag) { return tag && tag.toLowerCase(); });
        // @todo process config.tag_map (rename tag)
        if (typeof _config_1.default.tag_map === 'object') {
            for (var key in _config_1.default.tag_map) {
                if (Object.prototype.hasOwnProperty.call(_config_1.default.tag_map, key)) {
                    var renameTagTo = _config_1.default.tag_map[key];
                    var lowerkey = key.toLowerCase();
                    var hasTag = postLowerTags.includes(lowerkey);
                    if (hasTag) {
                        var indexTag = postLowerTags.indexOf(lowerkey);
                        //console.log('original tag', parse.metadata.tags[indexTag]);
                        data.metadata.tags[indexTag] = renameTagTo;
                        //console.log('renamed tag', renameTagTo);
                    }
                }
            }
        }
        // @todo grouping tag to category (config.tag_group)
        if (typeof _config_1.default.tag_group === 'object') {
            for (var key in _config_1.default.tag_group) {
                if (Object.prototype.hasOwnProperty.call(_config_1.default.tag_group, key)) {
                    var group = _config_1.default.tag_group[key];
                    var lowerkey = key.toLowerCase();
                    var hasTag = postLowerTags.includes(lowerkey);
                    if (hasTag) {
                        //const indexTag = postLowerTags.indexOf(lowerkey);
                        //console.log('original tag', parse.metadata.tags[indexTag]);
                        //console.log('grouped to', group);
                        data.metadata.category.push(group);
                    }
                }
            }
        }
        // @todo add tags from title
        if (_config_1.default.title_map) {
            var titleLowercase = data.metadata.title.toLowerCase();
            for (var key in _config_1.default.title_map) {
                if (Object.prototype.hasOwnProperty.call(_config_1.default.title_map, key)) {
                    var tag = _config_1.default.title_map[key];
                    var regexBoundary = new RegExp("\\b".concat(key, "\\b"), 'gmi');
                    if (titleLowercase.match(regexBoundary)) {
                        //console.log('found', regexBoundary, tag);
                        data.metadata.tags.push(tag);
                    }
                }
            }
        }
        // @todo remove default tag when tags have more than 1 item
        if (_config_1.default.default_tag &&
            data.metadata.tags.length > 1 &&
            data.metadata.tags.includes(_config_1.default.default_tag)) {
            data.metadata.tags = data.metadata.tags.filter(function (tag) { return tag !== _config_1.default.default_tag; });
        }
        // @todo remove default category when categories have more than 1 item
        if (_config_1.default.default_category &&
            data.metadata.category.length > 1 &&
            data.metadata.category.includes(_config_1.default.default_category)) {
            data.metadata.category = data.metadata.category.filter(function (category) { return category !== _config_1.default.default_category; });
        }
        // @todo remove duplicate categories
        data.metadata.category = __spreadArray([], __read(new Set(data.metadata.category)), false);
        // @todo remove duplicate tags
        data.metadata.tags = __spreadArray([], __read(new Set(data.metadata.tags)), false);
        // @todo set type post when not set
        if (!data.metadata.type)
            data.metadata.type = 'post';
    }
    // move 'programming' to first index
    if (data.metadata.category.includes('Programming')) {
        data.metadata.category.forEach(function (str, i) {
            if (str.toLowerCase().trim() === 'programming') {
                data.metadata.category = (0, array_utils_1.array_move)(data.metadata.category, i, 0);
            }
        });
    }
    if ('body' in data || 'content' in data) {
        // render post for some properties
        var html = void 0;
        try {
            var renderbody = (0, toHtml_1.renderBodyMarkdown)(data);
            html = (0, node_html_parser_1.parse)(renderbody);
        }
        catch (error) {
            console.log('[fail]', 'renderBodyMarkdown', error);
            //console.log(...log);
            //console.log(typeof parse.body);
            return null;
        }
        // +article wordcount
        var words = html
            .querySelectorAll('*:not(script,style,meta,link)')
            .map(function (e) { return e.text; })
            .join('\n');
        data.metadata.wordcount = (0, string_utils_1.countWords)(words);
        if (data.metadata.canonical) {
            var canonical = data.metadata.canonical;
            if (!(0, utils_1.isValidHttpUrl)(canonical))
                data.metadata.canonical = _config_1.default.url + data.metadata.canonical;
        }
    }
    modCache.putSync(cacheKey, (0, JSON_1.json_encode)(data));
    if (data.metadata && options.merge)
        return Object.assign(data, data.metadata);
    return data;
}
exports.modifyPost = modifyPost;
exports.default = modifyPost;
_g.modifyPost = modifyPost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWZ5UG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9wYXJzZXIvcG9zdC9tb2RpZnlQb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxREFBc0Q7QUFDdEQsMENBQWtEO0FBQ2xELHNEQUFvRDtBQUNwRCwwQ0FBMEM7QUFDMUMsd0NBQThDO0FBQzlDLGdEQUEwQztBQUMxQyx3REFBcUQ7QUFDckQsdURBQTJEO0FBQzNELGdFQUF5QztBQUN6QyxvQ0FBK0M7QUFJL0MsSUFBTSxRQUFRLEdBQUcsSUFBQSxjQUFNLEVBQUMsUUFBUSxDQUFDLENBQUM7QUFFbEM7Ozs7Ozs4Q0FNOEM7QUFDOUMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLE1BQU0sSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBaUIsQ0FBQztBQWtDOUUsU0FBZ0IsVUFBVSxDQUN4QixJQUFPLEVBQ1AsT0FHQztJQUhELHdCQUFBLEVBQUE7UUFDRSxLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLO0tBQzlCO0lBRUQsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRO1FBQzFFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUUzRSxJQUFJLEtBQWEsRUFBRSxJQUFZLEVBQUUsT0FBZSxFQUFFLElBQVksQ0FBQztJQUMvRCxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtRQUNqQyxJQUFJLE9BQU8sSUFBSSxL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