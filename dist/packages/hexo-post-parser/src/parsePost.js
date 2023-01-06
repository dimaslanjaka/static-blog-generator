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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.parsePost = void 0;
var deepmerge_ts_1 = require("deepmerge-ts");
var fs_extra_1 = require("fs-extra");
var jsdom_1 = require("jsdom");
var persistent_cache_1 = __importDefault(require("persistent-cache"));
var upath_1 = require("upath");
var yaml_1 = __importDefault(require("yaml"));
var dateMapper_1 = require("./dateMapper");
var generatePostId_1 = require("./generatePostId");
var utils_1 = require("./gulp/utils");
var toHtml_1 = require("./markdown/toHtml");
var array_unique_1 = __importStar(require("./node/array-unique"));
var color_1 = __importDefault(require("./node/color"));
var filemanager_1 = require("./node/filemanager");
var md5_file_1 = require("./node/md5-file");
var sanitize_filename_1 = __importDefault(require("./node/sanitize-filename"));
var utils_2 = require("./node/utils");
var parsePermalink_1 = require("./parsePermalink");
var codeblock_1 = require("./shortcodes/codeblock");
var css_1 = require("./shortcodes/css");
var extractText_1 = require("./shortcodes/extractText");
var hyperlinks_md2html_1 = require("./shortcodes/hyperlinks-md2html");
var include_1 = require("./shortcodes/include");
var script_1 = require("./shortcodes/script");
var time_1 = require("./shortcodes/time");
var youtube_1 = require("./shortcodes/youtube");
var _config_1 = require("./types/_config");
var string_1 = require("./utils/string");
var _cache = (0, persistent_cache_1.default)({
    base: (0, upath_1.join)(process.cwd(), 'tmp'),
    name: 'parsePost',
    duration: 1000 * 3600 * 24
});
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
    config: (0, _config_1.getConfig)(),
    cache: false,
    fix: false
};
function parsePost(target, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var siteConfig, homepage, fileTarget, cacheKey, getCache, originalFile, isFile, mapper, regexPost, testPost, regexPostNoOpening, testPost2, regexPage, testPage;
        var _this = this;
        return __generator(this, function (_a) {
            if (!target)
                return [2, null];
            options = (0, deepmerge_ts_1.deepmerge)(default_options, options);
            siteConfig = (0, _config_1.getConfig)();
            if (!options.sourceFile && (0, fs_extra_1.existsSync)(target))
                options.sourceFile = target;
            homepage = siteConfig.url.endsWith('/')
                ? siteConfig.url
                : siteConfig.url + '/';
            fileTarget = options.sourceFile || target;
            cacheKey = (0, fs_extra_1.existsSync)(fileTarget)
                ? (0, md5_file_1.md5FileSync)(fileTarget)
                : (0, md5_file_1.md5)(fileTarget);
            if (options.cache) {
                getCache = _cache.getSync(cacheKey);
                if (getCache)
                    return [2, getCache];
            }
            else {
            }
            originalFile = target;
            isFile = (0, fs_extra_1.existsSync)(target) && (0, fs_extra_1.statSync)(target).isFile();
            if (isFile) {
                target = String((0, fs_extra_1.readFileSync)(target, 'utf-8'));
                if (options.sourceFile)
                    originalFile = options.sourceFile;
            }
            mapper = function (m) { return __awaiter(_this, void 0, void 0, function () {
                var meta, body, bodyHtml, dom, date, lang, thumbnail, photos, author, tags, newExcerpt, publicFile_1, post_assets_fixer_1, imagefinderreplacement_1, regex, url, pattern, shortcodes, sourceFile, words, result;
                var _a;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!m) {
                                throw new Error(originalFile + ' cannot be mapped');
                            }
                            meta = {
                                title: '',
                                subtitle: '',
                                date: '',
                                tags: [],
                                categories: []
                            };
                            try {
                                meta = yaml_1.default.parse(m[1]);
                            }
                            catch (error) {
                                return [2, null];
                            }
                            if (typeof meta !== 'object') {
                                return [2, null];
                            }
                            body = m[2];
                            if (!body)
                                body = 'no content ' + (meta.title || '');
                            bodyHtml = (0, toHtml_1.renderMarkdownIt)(body);
                            dom = new jsdom_1.JSDOM(bodyHtml);
                            if (!meta.id) {
                                meta.id = (0, generatePostId_1.generatePostId)(meta);
                            }
                            if (options.fix) {
                                if (!meta.date) {
                                    meta.date = (0, dateMapper_1.moment)(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
                                }
                                if (meta.modified && !meta.updated) {
                                    meta.updated = (0, dateMapper_1.moment)(meta.modified).format('YYYY-MM-DDTHH:mm:ssZ');
                                }
                                if (!meta.updated) {
                                    date = String(meta.date);
                                    if (/\d{4}-\d-\d{2}/.test(date))
                                        date = new Date(String(meta.date));
                                    meta.updated = (0, dateMapper_1.moment)(date).format('YYYY-MM-DDTHH:mm:ssZ');
                                }
                                lang = meta.lang || meta.language;
                                if (!lang) {
                                    meta.lang = 'en';
                                    meta.language = 'en';
                                }
                            }
                            if (meta.category) {
                                if (!meta.categories || meta.categories.length === 0) {
                                    meta.categories = meta.category;
                                }
                                else if (Array.isArray(meta.category)) {
                                    meta.categories = (_a = meta.categories).concat.apply(_a, __spreadArray([], __read(meta.category), false));
                                }
                                delete meta.category;
                            }
                            if (!meta.categories)
                                meta.categories = [];
                            if (options.config.default_category && !meta.categories.length)
                                meta.categories.push(options.config.default_category);
                            if (!meta.tags)
                                meta.tags = [];
                            if (options.config.default_tag && !meta.tags.length)
                                meta.tags.push(options.config.default_tag);
                            if (!meta.date)
                                meta.date = (0, dateMapper_1.moment)().format();
                            if (!meta.updated) {
                                if (meta.modified) {
                                    meta.updated = meta.modified;
                                    delete meta.modified;
                                }
                                else {
                                    meta.updated = meta.date;
                                }
                            }
                            else {
                                if (meta.modified) {
                                    delete meta.modified;
                                }
                            }
                            if (options.fix) {
                                thumbnail = meta.cover || meta.thumbnail;
                                if (typeof thumbnail === 'string' && thumbnail.trim().length > 0) {
                                    if (!meta.thumbnail)
                                        meta.thumbnail = thumbnail;
                                    if (!meta.cover)
                                        meta.cover = thumbnail;
                                    if (!meta.photos) {
                                        meta.photos = [];
                                    }
                                    meta.photos.push(meta.cover);
                                }
                                if (Array.isArray(meta.photos)) {
                                    photos = meta.photos.filter(function (str) { return typeof str === 'string' && str.trim().length > 0; });
                                    meta.photos = (0, array_unique_1.default)(photos);
                                }
                            }
                            if (options.fix) {
                                author = meta.author || options.config.author;
                                if (!meta.author && author) {
                                    meta.author = author;
                                }
                            }
                            if (typeof meta.comments == 'undefined' || meta.comments == null)
                                meta.comments = true;
                            if (!meta.wordcount)
                                meta.wordcount = 0;
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
                                tags = Array.from(dom.window.document.body.getElementsByTagName('*'));
                                newExcerpt = [meta.title]
                                    .concat((0, array_unique_1.default)(tags.map(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim(); })))
                                    .flat()
                                    .join(' ')
                                    .substring(0, 300);
                                meta.description = newExcerpt;
                                meta.subtitle = newExcerpt;
                                meta.excerpt = newExcerpt;
                            }
                            if (options.fix) {
                                if (typeof meta.title !== 'string' || meta.title.trim().length === 0) {
                                    meta.title = (0, upath_1.basename)(options.sourceFile);
                                }
                                meta.title = (0, utils_2.cleanString)(meta.title);
                                meta.subtitle = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.subtitle));
                                meta.excerpt = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.excerpt));
                                meta.description = (0, utils_2.cleanWhiteSpace)((0, utils_2.cleanString)(meta.description));
                            }
                            if (options.fix) {
                                if (options.config.default_category)
                                    if (meta.categories.includes(options.config.default_category) &&
                                        meta.categories.length > 1) {
                                        meta.categories = meta.categories.filter(function (e) { return e !== options.config.default_category; });
                                    }
                                if (options.config.default_tag)
                                    if (meta.tags.includes(options.config.default_tag) &&
                                        meta.tags.length > 1) {
                                        meta.tags = meta.tags.filter(function (e) { return e !== options.config.default_tag; });
                                    }
                            }
                            if (options.fix &&
                                'photos' in meta &&
                                Array.isArray(meta.photos) &&
                                meta.photos.length > 0) {
                                try {
                                    meta.photos = (0, array_unique_1.uniqueStringArray)(meta.photos.filter(function (str) { return str.trim().length > 0; }));
                                }
                                catch (e) {
                                    console.error('cannot unique photos', meta.title, e.message);
                                }
                            }
                            if (Object.prototype.hasOwnProperty.call(meta, 'location') &&
                                !meta.location) {
                                delete meta.location;
                            }
                            if (isFile || options.sourceFile) {
                                if (isFile) {
                                    publicFile_1 = (0, filemanager_1.normalize)(originalFile);
                                }
                                else if (options.sourceFile) {
                                    publicFile_1 = (0, filemanager_1.normalize)(options.sourceFile);
                                }
                                else {
                                    throw new Error('cannot find public file of ' + meta.title);
                                }
                                post_assets_fixer_1 = function (sourcePath) {
                                    var _a;
                                    var logname = color_1.default.Blue('[PAF]');
                                    if (!publicFile_1)
                                        return sourcePath;
                                    sourcePath = sourcePath.replace(/['"](.*)['"]/gim, '').trim();
                                    if (sourcePath.startsWith('data:image'))
                                        return sourcePath;
                                    if (sourcePath.startsWith('//'))
                                        sourcePath = 'http:' + sourcePath;
                                    if (sourcePath.includes('%20'))
                                        sourcePath = decodeURIComponent(sourcePath);
                                    if (!(0, utils_1.isValidHttpUrl)(sourcePath) && !sourcePath.startsWith('/')) {
                                        var result_1 = null;
                                        var find1st = (0, upath_1.join)((0, upath_1.dirname)(publicFile_1), sourcePath);
                                        var find2nd = (0, upath_1.join)((0, upath_1.dirname)((0, upath_1.dirname)(publicFile_1)), sourcePath);
                                        var find3rd = (0, upath_1.join)(process.cwd(), sourcePath);
                                        var find4th = (0, upath_1.join)(_config_1.post_generated_dir, sourcePath);
                                        [find1st, find2nd, find3rd, find4th].forEach(function (src) {
                                            if (result_1 !== null)
                                                return;
                                            if ((0, fs_extra_1.existsSync)(src) && !result_1)
                                                result_1 = src;
                                        });
                                        if (result_1 === null) {
                                            var tempFolder = (0, upath_1.join)(process.cwd(), 'tmp');
                                            var logfile = (0, upath_1.join)(tempFolder, 'hexo-post-parser/errors/post-asset-folder/' +
                                                (0, sanitize_filename_1.default)((0, upath_1.basename)(sourcePath).trim(), '-') +
                                                '.log');
                                            if (!(0, fs_extra_1.existsSync)((0, upath_1.dirname)(logfile))) {
                                                (0, fs_extra_1.mkdirpSync)((0, upath_1.dirname)(logfile));
                                            }
                                            (0, fs_extra_1.writeFileSync)(logfile, JSON.stringify({
                                                str: sourcePath,
                                                f1: find1st,
                                                f2: find2nd,
                                                f3: find3rd,
                                                f4: find4th
                                            }, null, 2));
                                            console.log(logname, color_1.default.redBright('[fail]'), {
                                                str: sourcePath,
                                                log: logfile
                                            });
                                        }
                                        else {
                                            result_1 = (0, utils_2.replaceArr)(result_1, [(0, upath_1.toUnix)(process.cwd()), 'source/', '_posts', 'src-posts'], '/');
                                            result_1 = encodeURI((((_a = options.config) === null || _a === void 0 ? void 0 : _a.root) || '') + result_1);
                                            result_1 = (0, string_1.removeDoubleSlashes)(result_1);
                                            if (options.config && options.config['verbose'])
                                                console.log(logname, '[success]', result_1);
                                            return result_1;
                                        }
                                    }
                                    return sourcePath;
                                };
                                if (options.fix) {
                                    if (meta.cover) {
                                        meta.cover = post_assets_fixer_1(meta.cover);
                                    }
                                    if (meta.thumbnail) {
                                        meta.thumbnail = post_assets_fixer_1(meta.thumbnail);
                                    }
                                    if (!meta.photos)
                                        meta.photos = [];
                                    if (body && isFile) {
                                        imagefinderreplacement_1 = function (whole, m1) {
                                            var regex = /(?:".*")/;
                                            var replacementResult;
                                            var img;
                                            if (regex.test(m1)) {
                                                var replacement = m1.replace(regex, '').trim();
                                                img = post_assets_fixer_1(replacement);
                                                replacementResult = whole.replace(replacement, img);
                                            }
                                            if (!replacementResult) {
                                                img = post_assets_fixer_1(m1);
                                                replacementResult = whole.replace(m1, img);
                                            }
                                            if (typeof img === 'string')
                                                meta.photos.push(img);
                                            return replacementResult;
                                        };
                                        body = body.replace(/!\[.*\]\((.*)\)/gm, imagefinderreplacement_1);
                                        try {
                                            regex = /<img [^>]*src="[^"]*"[^>]*>/gm;
                                            if (regex.test(body)) {
                                                body.match(regex).map(function (x) {
                                                    return x.replace(/.*src="([^"]*)".*/, imagefinderreplacement_1);
                                                });
                                            }
                                        }
                                        catch (_e) {
                                            console.log('cannot find image html from', meta.title);
                                        }
                                    }
                                    if (Array.isArray(meta.photos)) {
                                        meta.photos = meta.photos
                                            .filter(function (str) { return typeof str === 'string' && str.trim().length > 0; })
                                            .map(function (photo) { return post_assets_fixer_1(photo); })
                                            .filter(function (x, i, a) {
                                            return a.indexOf(x) === i;
                                        });
                                        if (!meta.thumbnail && meta.photos.length > 0) {
                                            meta.thumbnail = meta.photos[0];
                                        }
                                    }
                                }
                                if (!meta.url) {
                                    url = (0, utils_2.replaceArr)((0, filemanager_1.normalize)(publicFile_1), [
                                        (0, filemanager_1.normalize)(process.cwd()),
                                        ((_b = options.config) === null || _b === void 0 ? void 0 : _b.source_dir) + '/_posts/',
                                        'src-posts/',
                                        '_posts/'
                                    ], '/')
                                        .replace(/\/+/, '/')
                                        .replace(/^\/+/, '/')
                                        .replace(/.md$/, '.html');
                                    meta.url = new URL(homepage + url)
                                        .toString()
                                        .replace(/([^:]\/)\/+/g, '$1');
                                }
                                if (!meta.type) {
                                    if (publicFile_1.match(/(_posts|_drafts|src-posts)\//)) {
                                        meta.type = 'post';
                                    }
                                    else {
                                        meta.type = 'page';
                                    }
                                }
                            }
                            if (!(typeof options === 'object')) return [3, 2];
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
                            if (!options.shortcodes) return [3, 2];
                            shortcodes = options.shortcodes;
                            sourceFile = void 0;
                            if (!isFile) {
                                if (!options.sourceFile)
                                    throw new Error('Shortcodes cannot process if options.sourceFile does not exist');
                                sourceFile = options.sourceFile;
                            }
                            else {
                                sourceFile = (0, upath_1.toUnix)(originalFile);
                            }
                            if (!body) return [3, 2];
                            if (sourceFile) {
                                if (shortcodes.include) {
                                    body = (0, include_1.parseShortCodeInclude)(sourceFile, body);
                                }
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
                            if (!shortcodes.codeblock) return [3, 2];
                            return [4, (0, codeblock_1.shortcodeCodeblock)(body)];
                        case 1:
                            body = _d.sent();
                            _d.label = 2;
                        case 2:
                            if (meta.wordcount === 0 &&
                                typeof body === 'string' &&
                                body.trim().length > 0) {
                                words = Array.from(dom.window.document.querySelectorAll('*:not(script,style,meta,link)'))
                                    .map(function (e) { return e.textContent; })
                                    .join('\n');
                                meta.wordcount = (0, string_1.countWords)(words);
                            }
                            meta = Object.keys(meta)
                                .sort()
                                .reduce(function (acc, key) {
                                var _a;
                                return (__assign(__assign({}, acc), (_a = {}, _a[key] = meta[key], _a)));
                            }, {});
                            result = {
                                metadata: meta,
                                body: body,
                                content: body,
                                config: siteConfig
                            };
                            if ('permalink' in result.metadata === false) {
                                result.metadata.permalink = (0, parsePermalink_1.parsePermalink)(result);
                            }
                            if (((_c = siteConfig.generator) === null || _c === void 0 ? void 0 : _c.type) === 'jekyll') {
                                result.metadata.slug = result.metadata.permalink;
                            }
                            if (isFile) {
                                result.fileTree = {
                                    source: (0, utils_2.replaceArr)((0, upath_1.toUnix)(originalFile), ['source/_posts/', '_posts/'], 'src-posts/'),
                                    public: (0, upath_1.toUnix)(originalFile).replace('/src-posts/', '/source/_posts/')
                                };
                            }
                            if (meta && body)
                                _cache.putSync(cacheKey, result);
                            return [2, result];
                    }
                });
            }); };
            regexPost = /^---([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
            testPost = Array.from(target.matchAll(regexPost)).map(mapper)[0];
            if (typeof testPost === 'object' && testPost !== null) {
                return [2, testPost];
            }
            regexPostNoOpening = /^([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
            testPost2 = Array.from(target.matchAll(regexPostNoOpening)).map(mapper)[0];
            if (typeof testPost2 === 'object' && testPost2 !== null) {
                return [2, testPost2];
            }
            regexPage = /^---([\s\S]*?)---[\n\s\S]([\n\s\S]*)/gm;
            testPage = Array.from(target.matchAll(regexPage)).map(mapper)[0];
            if (typeof testPage === 'object' && testPage !== null)
                return [2, testPage];
            return [2, null];
        });
    });
}
exports.parsePost = parsePost;
exports.default = parsePost;
