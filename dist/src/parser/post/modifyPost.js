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
function modifyPost(data, merge) {
    if (merge === void 0) { merge = false; }
    if (!data)
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
    var useCache = _config_1.default.generator.cache;
    var cacheKey = (0, md5_file_1.md5)(title + date + updated + type);
    if (useCache) {
        var get = modCache.getSync(cacheKey);
        if (typeof get == 'string')
            return JSON.parse(get);
        if (get)
            return get;
    }
    if ('metadata' in data) {
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
    /*// @todo prepare to add post category to cache
    parse.metadata.category.forEach((name: string) => {
      if (!name) return;
      // init
      if (!postCats[name]) postCats[name] = [];
      // prevent duplicate push
      if (!postCats[name].find(({ title }) => title === parse.metadata.title))
        postCats[name].push(<any>parse);
    });
  
    // @todo prepare to add post tag to cache
    parse.metadata.tags.forEach((name: string) => {
      if (!name) return;
      let post = postTags[name];
      // init
      if (!post) post = [];
      // prevent duplicate push
      if (!postTags[name].find(({ title }) => title === parse.metadata.title))
        postTags[name].push(<any>parse);
    });*/
    // @todo set type post when not set
    if (!data.metadata.type)
        data.metadata.type = 'post';
    // render post for some properties
    var html;
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
    // move 'programming' to first index
    if (data.metadata.category.includes('Programming')) {
        data.metadata.category.forEach(function (str, i) {
            if (str.toLowerCase().trim() === 'programming') {
                data.metadata.category = (0, array_utils_1.array_move)(data.metadata.category, i, 0);
            }
        });
    }
    /*scheduler.add('add-labels', () => {
      Bluebird.all([postCats, postTags]).each((group, index) => {
        for (const name in group) {
          if (Object.prototype.hasOwnProperty.call(group, name)) {
            const posts = group[name];
            if (index === 1) {
              cacheTags.set(name, posts);
            } else {
              cacheCats.set(name, posts);
            }
          }
        }
      });
    });*/
    modCache.putSync(cacheKey, (0, JSON_1.json_encode)(data));
    if (data.metadata && merge)
        return Object.assign(data, data.metadata);
    return data;
}
exports.modifyPost = modifyPost;
exports.default = modifyPost;
_g.modifyPost = modifyPost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWZ5UG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9wYXJzZXIvcG9zdC9tb2RpZnlQb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxREFBc0Q7QUFDdEQsMENBQWtEO0FBQ2xELHNEQUFvRDtBQUNwRCwwQ0FBMEM7QUFDMUMsd0NBQThDO0FBQzlDLGdEQUEwQztBQUMxQyx3REFBcUQ7QUFDckQsZ0VBQXlDO0FBQ3pDLG9DQUErQztBQUkvQyxJQUFNLFFBQVEsR0FBRyxJQUFBLGNBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQztBQUVsQzs7Ozs7OzhDQU04QztBQUM5QyxJQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sTUFBTSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFpQixDQUFDO0FBcUI5RSxTQUFnQixVQUFVLENBQ3hCLElBQU8sRUFDUCxLQUFhO0lBQWIsc0JBQUEsRUFBQSxhQUFhO0lBRWIsSUFBSSxDQUFDLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQztJQUN2QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBRTNFLElBQUksS0FBYSxFQUFFLElBQVksRUFBRSxPQUFlLEVBQUUsSUFBWSxDQUFDO0lBQy9ELENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1FBQ2pDLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxJQUFJO1lBQUUsT0FBTztRQUN6RCxJQUFJLE1BQU0sSUFBSSxJQUFJO1lBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckMsSUFBSSxPQUFPLElBQUksSUFBSTtZQUFF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