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
        // @todo redirect -> redirect_to for jekyll plugin
        // https://github.com/jekyll/jekyll-redirect-from
        if ('redirect' in data.metadata) {
            var redirect = data.metadata.redirect;
            data.metadata.redirect_to = redirect;
        }
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