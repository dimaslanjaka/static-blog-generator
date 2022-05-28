"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.parsePost = void 0;
var deepmerge_ts_1 = require("deepmerge-ts");
var fs_1 = require("fs");
var upath_1 = require("upath");
var yaml_1 = __importDefault(require("yaml"));
var persistent_cache_1 = __importDefault(require("../packages/persistent-cache"));
var dateMapper_1 = require("./dateMapper");
var utils_1 = require("./gulp/utils");
var array_unique_1 = __importStar(require("./node/array-unique"));
var md5_file_1 = require("./node/md5-file");
var utils_2 = require("./node/utils");
var uuid_1 = __importDefault(require("./node/uuid"));
var codeblock_1 = require("./shortcodes/codeblock");
var css_1 = require("./shortcodes/css");
var extractText_1 = require("./shortcodes/extractText");
var hyperlinks_md2html_1 = require("./shortcodes/hyperlinks-md2html");
var include_1 = require("./shortcodes/include");
var script_1 = require("./shortcodes/script");
var time_1 = require("./shortcodes/time");
var youtube_1 = require("./shortcodes/youtube");
var _config_1 = __importDefault(require("./types/_config"));
var _cache = (0, persistent_cache_1.default)({
    base: (0, upath_1.join)(process.cwd(), 'tmp/persistent-cache'),
    name: 'parsePost',
    duration: 1000 * 3600 * 24 // 24 hours
});
var homepage = new URL(_config_1.default.url);
var cwd = function () { return (0, upath_1.toUnix)(process.cwd()); };
/**
 * Hexo Generated Dir
 */
var post_generated_dir = (0, upath_1.join)(cwd(), _config_1.default.public_dir);
var default_options = {
    shortcodes: {
        css: false,
        script: false,
        include: false,
        youtube: false,
        link: false,
        text: false,
        now: false,
        codeblock: false
    },
    sourceFile: null,
    formatDate: false,
    config: _config_1.default,
    cache: false,
    fix: false
};
/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * @param target file path or string markdown contents (used for cache key)
 * @param options options parser
 * * {@link ParseOptions.sourceFile} used for cache key when `target` is file contents
 */
function parsePost(target, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var config, cacheKey, getCache, originalArg, isFile, mapper, regexPost, testPost, regexPostNoOpening, testPost2, regexPage, testPage;
        var _this = this;
        return __generator(this, function (_a) {
            if (!target)
                return [2 /*return*/, null];
            options = (0, deepmerge_ts_1.deepmerge)(default_options, options);
            config = options.config;
            cacheKey = (0, md5_file_1.md5FileSync)(options.sourceFile || target);
            if (options.cache) {
                getCache = _cache.getSync(cacheKey);
                if (getCache)
                    return [2 /*return*/, getCache];
            }
            originalArg = target;
            isFile = (0, fs_1.existsSync)(target) && (0, fs_1.statSync)(target).isFile();
            if (isFile) {
                target = String((0, fs_1.readFileSync)(target, 'utf-8'));
            }
            mapper = function (m) { return __awaiter(_this, void 0, void 0, function () {
                var meta, body, uid, sourceFile, stats, mtime, thumbnail, photos, author, newExcerpt, publicFile_1, post_assets_fixer, pattern, shortcodes, sourceFile, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            meta = {};
                            try {
                                meta = yaml_1.default.parse(m[1]);
                            }
                            catch (error) {
                                //if (error instanceof Error) console.log(error.message, 'cannot parse metadata');
                                return [2 /*return*/, null];
                            }
                            if (typeof meta !== 'object') {
                                //writeFileSync(join(cwd(), 'tmp/dump.json'), JSON.stringify(m, null, 2));
                                //console.log('meta required object');
                                return [2 /*return*/, null];
                            }
                            body = m[2];
                            if (!body)
                                body = 'no content ' + (meta.title || '');
                            //write(tmp('parsePost', 'original.log'), body).then(console.log);
                            if (!meta.uuid) {
                                uid = m[0];
                                if (meta.title && meta.webtitle) {
                                    uid = meta.title + meta.webtitle;
                                }
                                else if (meta.subtitle) {
                                    uid = meta.subtitle;
                                }
                                else if (meta.excerpt) {
                                    uid = meta.excerpt;
                                }
                                else if (meta.title) {
                                    uid = meta.title;
                                }
                                meta.uuid = (0, uuid_1.default)(uid);
                                meta = Object.keys(meta)
                                    .sort()
                                    .reduce(function (acc, key) {
                                    var _a;
                                    return (__assign(__assign({}, acc), (_a = {}, _a[key] = meta[key], _a)));
                                }, {});
                            }
                            if (options.fix) {
                                // @todo fix date
                                if (!meta.date) {
                                    meta.date = (0, dateMapper_1.moment)(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
                                }
                                if (meta.modified && !meta.updated) {
                                    meta.updated = (0, dateMapper_1.moment)(meta.modified).format('YYYY-MM-DDTHH:mm:ssZ');
                                }
                                if (isFile) {
                                    sourceFile = (0, upath_1.toUnix)(originalArg);
                                    if ((0, fs_1.existsSync)(sourceFile)) {
                                        stats = (0, fs_1.statSync)(sourceFile);
                                        if (!meta.updated) {
                                            mtime = stats.mtime;
                                            meta.updated = (0, dateMapper_1.moment)(mtime).format('YYYY-MM-DDTHH:mm:ssZ');
                                        }
                                    }
                                }
                                // @todo fix lang
                                if (!meta.lang)
                                    meta.lang = 'en';
                            }
                            // @todo set default category and tags
                            if (!meta.category)
                                meta.category = [];
                            if (config.default_category && !meta.category.length)
                                meta.category.push(config.default_category);
                            if (!meta.tags)
                                meta.tags = [];
                            if (config.default_tag && !meta.tags.length)
                                meta.tags.push(config.default_tag);
                            // @todo set default date post
                            if (!meta.date)
                                meta.date = (0, dateMapper_1.moment)().format();
                            if (!meta.updated) {
                                if (meta.modified) {
                                    // fix for hexo-blogger-xml
                                    meta.updated = meta.modified;
                                    delete meta.modified;
                                }
                                else {
                                    meta.updated = meta.date;
                                }
                            }
                            // @todo fix thumbnail
                            if (options.fix) {
                                thumbnail = meta.cover || meta.thumbnail;
                                if (thumbnail) {
                                    if (!meta.thumbnail)
                                        meta.thumbnail = thumbnail;
                                    if (!meta.cover)
                                        meta.cover = thumbnail;
                                    if (!meta.photos) {
                                        meta.photos = [];
                                    }
                                    meta.photos.push(meta.cover);
                                }
                                if (meta.photos) {
                                    photos = meta.photos;
                                    meta.photos = (0, array_unique_1.default)(photos);
                                }
                            }
                            // @todo fix post author
                            if (options.fix) {
                                author = meta.author || config.author;
                                if (!meta.author && author) {
                                    meta.author = author;
                                }
                            }
                            // @todo set default enable comments
                            if (typeof meta.comments == 'undefined' || meta.comments == null)
                                meta.comments = true;
                            // @todo set default wordcount to 0
                            if (!meta.wordcount)
                                meta.wordcount = 0;
                            // @todo set default excerpt/description
                            if (meta.subtitle) {
                                meta.excerpt = meta.subtitle;
                                meta.description = meta.subtitle;
                            }
                            else if (meta.description && !meta.excerpt) {
                                meta.subtitle = meta.description;
                                meta.excerpt = meta.description;
                            }
                            else if (meta.excerpt && !meta.description) {
                                meta.description = meta.excerpt;
                                meta.subtitle = meta.excerpt;
                            }
                            else {
                                newExcerpt = "".concat(meta.title, " - ").concat(config.title);
                                meta.description = newExcerpt;
                                meta.subtitle = newExcerpt;
                                meta.excerpt = newExcerpt;
                            }
                            // @todo fix description
                            if (options.fix) {
                                // fix empty title
                                if (typeof meta.title !== 'string' || meta.title.trim().length === 0) {
                                    meta.title = (0, upath_1.basename)(options.sourceFile);
                                }
                                // fix special char in metadata
                                meta.title = (0, utils_2.cleanString)(meta.title);
                                meta.subtitle = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.subtitle));
                                meta.excerpt = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.excerpt));
                                meta.description = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.description));
                            }
                            // @todo fix default category and tags
                            if (options.fix) {
                                // remove uncategorized if programming category pushed
                                if (config.default_category)
                                    if (meta.category.includes(config.default_category) &&
                                        meta.category.length > 1) {
                                        meta.category = meta.category.filter(function (e) { return e !== config.default_category; });
                                    }
                                // @todo remove untagged if programming category pushed
                                if (config.default_tag)
                                    if (meta.tags.includes(config.default_tag) && meta.tags.length > 1) {
                                        meta.tags = meta.tags.filter(function (e) { return e !== config.default_tag; });
                                    }
                            }
                            // @todo remove duplicated metadata photos
                            if (options.fix && meta.photos && meta.photos.length) {
                                meta.photos = (0, array_unique_1.uniqueStringArray)(meta.photos);
                            }
                            // @todo delete location
                            if (Object.prototype.hasOwnProperty.call(meta, 'location') &&
                                !meta.location) {
                                delete meta.location;
                            }
                            if (isFile || options.sourceFile) {
                                publicFile_1 = isFile
                                    ? (0, upath_1.toUnix)(originalArg)
                                    : (0, upath_1.toUnix)(options.sourceFile);
                                // @todo fix post_asset_folder
                                if (options.fix) {
                                    post_assets_fixer = function (str) {
                                        if (!publicFile_1)
                                            return str;
                                        // return base64 image
                                        if (str.startsWith('data:image'))
                                            return str;
                                        if (str.startsWith('//'))
                                            str = 'http:' + str;
                                        if (str.includes('%20'))
                                            str = decodeURIComponent(str);
                                        if (!(0, utils_1.isValidHttpUrl)(str) && !str.startsWith('/')) {
                                            var result_1;
                                            /** search from same directory */
                                            var f1 = (0, upath_1.join)((0, upath_1.dirname)(publicFile_1), str);
                                            /** search from parent directory */
                                            var f2 = (0, upath_1.join)((0, upath_1.dirname)((0, upath_1.dirname)(publicFile_1)), str);
                                            /** search from root directory */
                                            var f3 = (0, upath_1.join)(cwd(), str);
                                            var f4 = (0, upath_1.join)(post_generated_dir, str);
                                            [f1, f2, f3, f4].forEach(function (src) {
                                                if ((0, fs_1.existsSync)(src) && !result_1)
                                                    result_1 = src;
                                            });
                                            if (!result_1) {
                                                console.log('[PAF][fail]', str);
                                            }
                                            else {
                                                result_1 = (0, utils_2.replaceArr)(result_1, [cwd(), 'source/', '_posts'], '/').replace(/\/+/, '/');
                                                result_1 = encodeURI(result_1);
                                                console.log('[PAF][success]', result_1);
                                                return result_1;
                                            }
                                        }
                                        return str;
                                    };
                                    if (meta.cover) {
                                        meta.cover = post_assets_fixer(meta.cover);
                                    }
                                    if (meta.thumbnail) {
                                        meta.thumbnail = post_assets_fixer(meta.thumbnail);
                                    }
                                    if (meta.photos) {
                                        meta.photos = meta.photos.map(post_assets_fixer);
                                    }
                                }
                                if (!meta.url) {
                                    homepage.pathname = (0, utils_2.replaceArr)(publicFile_1, [
                                        (0, upath_1.toUnix)(process.cwd()),
                                        config.source_dir + '/_posts/',
                                        'src-posts/',
                                        '_posts/'
                                    ], '/')
                                        // @todo remove multiple slashes
                                        .replace(/\/+/, '/')
                                        // @todo replace .md to .html
                                        .replace(/.md$/, '.html');
                                    // meta url with full url
                                    meta.url = homepage.toString();
                                    // meta permalink just pathname
                                    meta.permalink = homepage.pathname;
                                }
                                // determine post type
                                //meta.type = toUnix(originalArg).isMatch(/(_posts|src-posts)\//) ? 'post' : 'page';
                                if (!meta.type) {
                                    if (publicFile_1.match(/(_posts|src-posts)\//)) {
                                        meta.type = 'post';
                                    }
                                    else {
                                        meta.type = 'page';
                                    }
                                }
                            }
                            if (!(typeof options === 'object')) return [3 /*break*/, 2];
                            // @todo format dates
                            if (options.formatDate) {
                                pattern = typeof options.formatDate === 'object' && options.formatDate.pattern
                                    ? options.formatDate.pattern
                                    : 'YYYY-MM-DDTHH:mm:ssZ';
                                if (meta.date) {
                                    meta.date = new dateMapper_1.dateMapper(String(meta.date)).format(pattern);
                                }
                                if (meta.updated) {
                                    meta.updated = new dateMapper_1.dateMapper(String(meta.updated)).format(pattern);
                                }
                            }
                            if (!options.shortcodes) return [3 /*break*/, 2];
                            shortcodes = options.shortcodes;
                            sourceFile = void 0;
                            if (!isFile) {
                                if (!options.sourceFile)
                                    throw new Error('Shortcodes cannot process if options.sourceFile does not exist');
                                sourceFile = options.sourceFile;
                            }
                            else {
                                sourceFile = (0, upath_1.toUnix)(originalArg);
                            }
                            if (!body) return [3 /*break*/, 2];
                            if (sourceFile) {
                                if (shortcodes.include)
                                    body = (0, include_1.parseShortCodeInclude)(sourceFile, body);
                                if (shortcodes.now)
                                    body = (0, time_1.shortcodeNow)(sourceFile, body);
                                if (shortcodes.script)
                                    body = (0, script_1.shortcodeScript)(sourceFile, body);
                                if (shortcodes.css)
                                    body = (0, css_1.shortcodeCss)(sourceFile, body);
                                if (shortcodes.text)
                                    body = (0, extractText_1.extractText)(sourceFile, body);
                            }
                            if (shortcodes.link)
                                body = (0, hyperlinks_md2html_1.replaceMD2HTML)(body);
                            if (shortcodes.youtube)
                                body = (0, youtube_1.shortcodeYoutube)(body);
                            if (!shortcodes.codeblock) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, codeblock_1.shortcodeCodeblock)(body)];
                        case 1:
                            body = _a.sent();
                            _a.label = 2;
                        case 2:
                            result = {
                                metadata: meta,
                                body: body,
                                content: body,
                                config: config
                            };
                            // put fileTree
                            if (isFile) {
                                result.fileTree = {
                                    source: (0, utils_2.replaceArr)((0, upath_1.toUnix)(originalArg), ['source/_posts/', '_posts/'], 'src-posts/'),
                                    public: (0, upath_1.toUnix)(originalArg).replace('/src-posts/', '/source/_posts/')
                                };
                            }
                            if (meta && body)
                                _cache.putSync(cacheKey, result);
                            return [2 /*return*/, result];
                    }
                });
            }); };
            regexPost = /^---([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
            testPost = Array.from(target.matchAll(regexPost)).map(mapper)[0];
            if (typeof testPost === 'object' && testPost !== null) {
                //console.log('test 1 passed');
                return [2 /*return*/, testPost];
            }
            regexPostNoOpening = /^([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
            testPost2 = Array.from(target.matchAll(regexPostNoOpening)).map(mapper)[0];
            if (typeof testPost2 === 'object' && testPost2 !== null) {
                //console.log('test 2 passed');
                return [2 /*return*/, testPost2];
            }
            regexPage = /^---([\s\S]*?)---[\n\s\S]([\n\s\S]*)/gm;
            testPage = Array.from(target.matchAll(regexPage)).map(mapper)[0];
            if (typeof testPage === 'object' && testPage !== null)
                return [2 /*return*/, testPage];
            return [2 /*return*/, null];
        });
    });
}
exports.parsePost = parsePost;
exports.default = parsePost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VQb3N0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsicGFja2FnZXMvaGV4by1wb3N0LXBhcnNlci9zcmMvcGFyc2VQb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBeUM7QUFDekMseUJBQXdEO0FBQ3hELCtCQUF3RDtBQUN4RCw4Q0FBd0I7QUFDeEIsa0ZBQWlEO0FBQ2pELDJDQUFrRDtBQUNsRCxzQ0FBOEM7QUFDOUMsa0VBQXFFO0FBQ3JFLDRDQUE4QztBQUM5QyxzQ0FBd0U7QUFDeEUscURBQWlDO0FBQ2pDLG9EQUE0RDtBQUM1RCx3Q0FBZ0Q7QUFDaEQsd0RBQXVEO0FBQ3ZELHNFQUFpRTtBQUNqRSxnREFBNkQ7QUFDN0QsOENBQXNEO0FBQ3RELDBDQUFpRDtBQUNqRCxnREFBd0Q7QUFFeEQsNERBQXFDO0FBRXJDLElBQU0sTUFBTSxHQUFHLElBQUEsMEJBQUssRUFBQztJQUNuQixJQUFJLEVBQUUsSUFBQSxZQUFJLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHNCQUFzQixDQUFDO0lBQ2pELElBQUksRUFBRSxXQUFXO0lBQ2pCLFFBQVEsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxXQUFXO0NBQ3ZDLENBQUMsQ0FBQztBQUNILElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsSUFBTSxHQUFHLEdBQUcsY0FBTSxPQUFBLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFyQixDQUFxQixDQUFDO0FBQ3hDOztHQUVHO0FBQ0gsSUFBTSxrQkFBa0IsR0FBRyxJQUFBLFlBQUksRUFBQyxHQUFHLEVBQUUsRUFBRSxpQkFBTSxDQUFDLFVBQVUsQ0FBQyxD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