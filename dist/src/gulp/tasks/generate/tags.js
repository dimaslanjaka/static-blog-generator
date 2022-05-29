"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTags = void 0;
var gulp_1 = __importDefault(require("gulp"));
var path_1 = require("path");
var cache_1 = require("../../../node/cache");
var cache_post_1 = __importDefault(require("../../../node/cache-post"));
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var scheduler_1 = __importDefault(require("../../../node/scheduler"));
var postMapper_1 = require("../../../parser/post/postMapper");
var _config_1 = require("../../../types/_config");
//const cacheTags = new CacheFile('postTags');
var cacheTags = (0, cache_1.pcache)('tags');
/**
 * generate tags archive
 * @param labelname specific tag name
 * @param pagenum specific page number
 */
function generateTags(labelname, pagenum) {
    return __awaiter(this, void 0, void 0, function () {
        var tags, indexTag, tagname, tag_posts, logname;
        return __generator(this, function (_a) {
            tags = cacheTags.keysSync();
            if (!tags.length) {
                console.log('tags empty');
                return [2 /*return*/];
            }
            for (indexTag = 0; indexTag < tags.length; indexTag++) {
                tagname = tags[indexTag];
                tag_posts = cacheTags.getSync(tagname);
                if (tag_posts.length === 0) {
                    console.log("tag ".concat(tagname, " not have post"));
                    continue;
                }
                logname = color_1.default['Desert Sand']('[generate][tag]') +
                    color_1.default['Wild Blue Yonder']("[".concat(tagname, "]"));
                // specific tag label otherwise skip
                if (typeof labelname == 'string' &&
                    labelname.trim().length > 0 &&
                    tagname.toLowerCase() !== labelname.toLowerCase()) {
                    // console.log(logname, tagname, '!==', labelname);
                    continue;
                }
                if (_config_1.isDev)
                    (0, filemanager_1.write)((0, path_1.join)(__dirname, 'tmp/tags', tagname + '.json'), tag_posts.map(function (post) { return (0, postMapper_1.simplifyDump)(post); }));
                // skip non array
                if (!tag_posts[tagname] || !Array.isArray(tag_posts[tagname]))
                    continue;
                console.log(logname, 'start');
            }
            return [2 /*return*/, null];
        });
    });
}
exports.generateTags = generateTags;
exports.default = generateTags;
scheduler_1.default.add('add-tags', function () {
    // iterate posts to get tags
    var posts = new cache_post_1.default();
    var postTags = {};
    var allPosts = posts.getAll();
    var _loop_1 = function (indexPost) {
        var post = allPosts[indexPost];
        if (post.metadata.tags && !post.metadata.redirect) {
            if (!Array.isArray(post.metadata.tags)) {
                post.metadata.tags = [post.metadata.tags];
            }
            for (var indexTag = 0; indexTag < post.metadata.tags.length; indexTag++) {
                var tagName = post.metadata.tags[indexTag];
                if (!postTags[tagName])
                    postTags[tagName] = [];
                if (!postTags[tagName].find(function (_a) {
                    var metadata = _a.metadata;
                    return metadata.title === post.metadata.title;
                })) {
                    postTags[tagName].push(post);
                }
                if (postTags[tagName].length > 0) {
                    cacheTags.putSync(tagName, postTags[tagName]);
                }
            }
        }
    };
    for (var indexPost = 0; indexPost < allPosts.length; indexPost++) {
        _loop_1(indexPost);
    }
});
gulp_1.default.task('generate:tags', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFncy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2dlbmVyYXRlL3RhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLDZCQUE0QjtBQUM1Qiw2Q0FBNkM7QUFDN0Msd0VBQWlEO0FBQ2pELDhEQUF3QztBQUN4Qyx5REFBa0Q7QUFDbEQsc0VBQWdEO0FBRWhELDhEQUErRDtBQUMvRCxrREFBK0M7QUFDL0MsOENBQThDO0FBQzlDLElBQU0sU0FBUyxHQUFHLElBQUEsY0FBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDOzs7O0dBSUc7QUFDSCxTQUFzQixZQUFZLENBQ2hDLFNBQXlCLEVBQ3pCLE9BQWdCOzs7O1lBRVYsSUFBSSxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDMUIsc0JBQU87YUFDUjtZQUNELEtBQVMsUUFBUSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDbkQsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekIsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQVksT0FBTyxDQUFDLENBQUM7Z0JBQ3hELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBTyxPQUFPLG1CQUFnQixDQUFDLENBQUM7b0JBQzVDLFNBQVM7aUJBQ1Y7Z0JBQ0ssT0FBTyxHQUNYLGVBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDdkMsZUFBSyxDQUFDLGtCQUFrQixDQUFD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