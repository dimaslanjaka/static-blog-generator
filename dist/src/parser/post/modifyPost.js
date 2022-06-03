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
var useCache = _config_1.default.generator.cache;
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
    var cacheKey = (0, md5_file_1.md5)(data.metadata.title +
        data.metadata.date +
        data.metadata.updated +
        data.metadata.type);
    /*if (parse.fileTree) {
      if (parse.fileTree.source) {
        cacheKey = md5(parse.fileTree.source);
      }
    }*/
    if (useCache) {
        var get = modCache.getSync(cacheKey);
        if (typeof get == 'string')
            return JSON.parse(get);
        if (get)
            return get;
    }
    // @todo setup empty tags and categories when not set
    if (!Array.isArray(data.metadata.category)) {
        data.metadata.category = [_config_1.default.default_category].filter(function (s) { return s; });
    }
    if (!Array.isArray(data.metadata.tags)) {
        data.metadata.tags = [_config_1.default.default_tag].filter(function (s) { return s; });
    }
    // @todo add tags from title
    if (_config_1.default.title_map && typeof data.metadata.title == 'string') {
        var title = data.metadata.title.toLowerCase();
        for (var key in _config_1.default.title_map) {
            if (Object.prototype.hasOwnProperty.call(_config_1.default.title_map, key)) {
                var tag = _config_1.default.title_map[key];
                var regexBoundary = new RegExp("\\b".concat(key, "\\b"), 'gmi');
                if (title.match(regexBoundary)) {
                    //console.log('found', regexBoundary, tag);
                    data.metadata.tags.push(tag);
                }
            }
        }
    }
    // tag mapper
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
    // @todo grouping tag to category
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWZ5UG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9wYXJzZXIvcG9zdC9tb2RpZnlQb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxREFBc0Q7QUFDdEQsMENBQWtEO0FBQ2xELHNEQUFvRDtBQUNwRCwwQ0FBMEM7QUFDMUMsd0NBQThDO0FBQzlDLGdEQUEwQztBQUMxQyx3REFBcUQ7QUFDckQsZ0VBQXlDO0FBQ3pDLG9DQUErQztBQUkvQyxJQUFNLFFBQVEsR0FBRyxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFDeEMsSUFBTSxRQUFRLEdBQUcsSUFBQSxjQUFNLEVBQUMsUUFBUSxDQUFDLENBQUM7QUFFbEM7Ozs7Ozs4Q0FNOEM7QUFDOUMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLE1BQU0sSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBaUIsQ0FBQztBQXNCOUUsU0FBZ0IsVUFBVSxDQUN4QixJQUFPLEVBQ1AsS0FBYTtJQUFiLHNCQUFBLEVBQUEsYUFBYTtJQUViLElBQUksQ0FBQyxJQUFJO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDdkIsSUFBTSxRQUFRLEdBQUcsSUFBQSxjQUFHLEVBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSztRQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUk7UUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPO1FBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNyQixDQUFDO0lBQ0Y7Ozs7T0FJRztJQUNILElBQUksUUFBUSxFQUFFO1FBQ1osSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBYyxRQUFRLENBQUMsQ0FBQztRQUNwRCxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVE7WUFBRSxPQUFPLElBQUks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