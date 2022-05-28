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
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var array_wrapper_1 = require("../../../node/array-wrapper");
var cache_1 = require("../../../node/cache");
var cache_post_1 = __importDefault(require("../../../node/cache-post"));
var color_1 = __importDefault(require("../../../node/color"));
var scheduler_1 = __importDefault(require("../../../node/scheduler"));
var modifyPost_1 = __importDefault(require("../../../parser/post/modifyPost"));
var postChunksIterator_1 = __importDefault(require("../../../parser/post/postChunksIterator"));
var postMapper_1 = require("../../../parser/post/postMapper");
var EJSRenderer_1 = require("../../../renderer/ejs/EJSRenderer");
var excerpt_1 = require("../../../renderer/ejs/helper/excerpt");
var thumbnail_1 = require("../../../renderer/ejs/helper/thumbnail");
var _config_1 = __importStar(require("../../../types/_config"));
//const cacheTags = new CacheFile('postTags');
var cacheTags = (0, cache_1.pcache)('tags');
/**
 * generate tags archive
 * @param labelname specific tag name
 * @param pagenum specific page number
 */
function generateTags(labelname, pagenum) {
    return __awaiter(this, void 0, void 0, function () {
        var tags, indexTag, tagName, tag_posts, logname, indexTagPost, treeChunks, parentChunks, current_page, innerChunks, data, saveTo, pagemeta, merge_data, pagedata, rendered, f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tags = cacheTags.keysSync();
                    if (!tags.length) {
                        console.log('tags empty');
                        return [2 /*return*/];
                    }
                    indexTag = 0;
                    _a.label = 1;
                case 1:
                    if (!(indexTag < tags.length)) return [3 /*break*/, 8];
                    tagName = tags[indexTag];
                    tag_posts = cacheTags.getSync(tagName);
                    logname = color_1.default['Desert Sand']('[generate][tag]') +
                        color_1.default['Wild Blue Yonder']("[".concat(tagName, "]"));
                    console.log(logname);
                    // specific tag label otherwise skip
                    if (typeof labelname == 'string' &&
                        labelname.trim().length > 0 &&
                        tagName.toLowerCase() !== labelname.toLowerCase()) {
                        if (_config_1.default.verbose)
                            console.log(logname, tagName, '!==', labelname);
                        return [3 /*break*/, 7];
                    }
                    // skip non array
                    if (!tag_posts[tagName] || !Array.isArray(tag_posts[tagName]))
                        return [3 /*break*/, 7];
                    console.log(logname, 'start');
                    indexTagPost = 0;
                    _a.label = 2;
                case 2:
                    if (!(indexTagPost < tag_posts.length)) return [3 /*break*/, 7];
                    treeChunks = (0, postMapper_1.post_chunks)(tag_posts[tagName]);
                    parentChunks = treeChunks.chunk;
                    current_page = 0;
                    _a.label = 3;
                case 3:
                    if (!(current_page < parentChunks.length)) return [3 /*break*/, 6];
                    // @todo check specific page number is set, otherwise skip
                    if (typeof pagenum == 'number' && current_page !== pagenum)
                        return [3 /*break*/, 5];
                    innerChunks = (0, array_wrapper_1.array_wrap)(parentChunks[current_page]);
                    data = (0, postChunksIterator_1.default)(innerChunks, {
                        current_page: current_page,
                        base: (0, upath_1.join)(_config_1.default.tag_dir, tagName),
                        parentChunks: parentChunks,
                        treeChunks: treeChunks
                    });
                    saveTo = (0, upath_1.join)((0, _config_1.cwd)(), _config_1.default.public_dir, data.perm_current, 'index.html');
                    pagemeta = {
                        metadata: {
                            title: 'Tag: ' + tagName,
                            description: (0, excerpt_1.excerpt)(_config_1.default),
                            date: data.latestUpdated,
                            updated: data.latestUpdated,
                            cover: (0, thumbnail_1.thumbnail)(data.posts[0]),
                            category: [],
                            tags: [],
                            type: 'archive'
                        },
                        body: '',
                        content: '',
                        fileTree: {
                            source: null,
                            public: null
                        }
                    };
                    if (current_page > 0) {
                        pagemeta.metadata.title = 'Tag: ' + tagName + ' Page ' + current_page;
                    }
                    merge_data = Object.assign(pagemeta, data);
                    pagedata = (0, modifyPost_1.default)(merge_data);
                    return [4 /*yield*/, (0, EJSRenderer_1.EJSRenderer)(pagedata)];
                case 4:
                    rendered = _a.sent();
                    f = (0, fs_1.writeFileSync)(saveTo, rendered);
                    console.log(logname, f);
                    if (_config_1.default.verbose) {
                        (0, fs_1.writeFileSync)((0, _config_1.tmp)('generateTags', data.perm_current + '.log'), (0, postMapper_1.simplifyDump)(pagedata));
                    }
                    if (labelname)
                        return [2 /*return*/, rendered];
                    _a.label = 5;
                case 5:
                    current_page++;
                    return [3 /*break*/, 3];
                case 6:
                    indexTagPost++;
                    return [3 /*break*/, 2];
                case 7:
                    indexTag++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, null];
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFncy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2dlbmVyYXRlL3RhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBbUM7QUFDbkMsOENBQXdCO0FBQ3hCLCtCQUE2QjtBQUM3Qiw2REFBeUQ7QUFDekQsNkNBQTZDO0FBQzdDLHdFQUFpRDtBQUNqRCw4REFBd0M7QUFDeEMsc0VBQWdEO0FBQ2hELCtFQUF5RDtBQUV6RCwrRkFBeUU7QUFDekUsOERBQTRFO0FBQzVFLGlFQUFnRTtBQUNoRSxnRUFBK0Q7QUFDL0Qsb0VBQW1FO0FBQ25FLGdFQUEwRDtBQUMxRCw4Q0FBOEM7QUFDOUMsSUFBTSxTQUFTLEdBQUcsSUFBQSxjQUFNLEVBQUMsTUFBTSxDQUFDLENBQUM7QUFDakM7Ozs7R0FJRztBQUNILFNBQXNCLFlBQVksQ0FDaEMsU0FBeUIsRUFDekIsT0FBZ0I7Ozs7OztvQkFFVixJQUFJLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDMUIsc0JBQU87cUJBQ1I7b0JBQ1EsUUFBUSxHQUFHLENBQUM7Ozt5QkFBRSxDQUFBLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO29CQUNyQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN6QixTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBWSxPQUFPLENBQUMsQ0FBQztvQkFDbEQsT0FBTyxHQUNYLGVBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQzt3QkFDdkMsZUFBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsV0FBSSxPQUFPLE1B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