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
var bluebird_1 = __importDefault(require("bluebird"));
var chalk_1 = __importDefault(require("chalk"));
var gulp_1 = __importDefault(require("gulp"));
var moment_1 = __importDefault(require("moment"));
var cache_post_1 = require("../../../node/cache-post");
var filemanager_1 = require("../../../node/filemanager");
var date_1 = require("../../../renderer/ejs/helper/date");
var _config_1 = __importStar(require("../../../types/_config"));
/// define global variable without refetch them
var logname = chalk_1.default.magentaBright('[sitemap-xml]');
var homepage = new URL(_config_1.default.url);
/**
 * list posts of each categories
 */
var listCats = {};
/**
 * list posts of each tags
 */
var listTags = {};
/**
 * all mapped posts
 */
var allPosts = (function () {
    try {
        return (bluebird_1.default.all((0, cache_post_1.getAllPosts)())
            .map(function (post) {
            if (!post)
                return;
            if (typeof post.metadata !== 'object')
                return;
            if (!post.metadata.type || !post.metadata.type.length)
                if (post.fileTree)
                    if (typeof post.fileTree.public == 'string')
                        if (!post.metadata.type)
                            post.metadata.type = post.fileTree.public.includes('_posts')
                                ? 'post'
                                : 'page';
            var cats = post.metadata.category;
            var tags = post.metadata.tags;
            if (cats) {
                if (Array.isArray(cats)) {
                    cats.forEach(function (cat) {
                        if (!listCats[cat])
                            listCats[cat] = [];
                        listCats[cat].push(post);
                    });
                }
            }
            if (tags) {
                if (Array.isArray(tags)) {
                    tags.forEach(function (tag) {
                        if (!listTags[tag])
                            listTags[tag] = [];
                        listTags[tag].push(post);
                    });
                }
            }
            return post;
        })
            // filter unecessary files
            .filter(function (post) {
            if (!post)
                return false;
            if (!post.metadata)
                return false;
            if (!post.metadata.url)
                return false;
            var u = post.metadata.url;
            var ex = {
                /**
                 * standard non-sitemap files
                 */
                major: !u.match(/\/.(guid|git|eslint|tslint|prettierc)|(404).html$/),
                /**
                 * project test development files
                 */
                dev: !u.match(/(Test|guide)\//)
            };
            return Object.values(ex).every(Boolean);
        }));
    }
    catch (error) {
        return bluebird_1.default.resolve([]);
    }
})();
/**
 * copy asset sitemaps
 */
function copy() {
    var srcdir = (0, filemanager_1.join)(__dirname, 'views');
    console.log(logname, 'copy', srcdir, '->', _config_1.post_generated_dir);
    return gulp_1.default
        .src('**/*.{xsd,xsl}', { cwd: srcdir })
        .pipe(gulp_1.default.dest(_config_1.post_generated_dir));
}
function _generateLabels(done) {
    var sourceIndexXML = (0, filemanager_1.join)(__dirname, 'views/tag-sitemap.xml');
    var readXML = (0, filemanager_1.read)(sourceIndexXML, 'utf-8');
    var mapTags = [];
    // generate tags by tag name
    for (var tagname in listCats) {
        if (Object.prototype.hasOwnProperty.call(listCats, tagname)) {
            var tags = listCats[tagname].sort(date_1.sortByDate).map(function (item) {
                if (item.metadata.updated)
                    return (0, moment_1.default)(item.metadata.updated.toString());
                if (item.metadata.date)
                    return (0, moment_1.default)(item.metadata.date.toString());
            });
            var lastmod = (0, moment_1.default)((0, date_1.getLatestDateArray)(tags)).format('YYYY-MM-DDTHH:mm:ssZ');
            homepage.pathname = (0, filemanager_1.join)(_config_1.default.tag_dir, tagname);
            var url = homepage.toString();
            var str = "<url><loc>".concat(url, "</loc><lastmod>").concat(lastmod, "</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>");
            mapTags.push(str);
        }
    }
    var buildXML = readXML.replace(/<url>+[\s\S\n]*<\/url>/gm, mapTags.join('\n'));
    (0, filemanager_1.write)((0, filemanager_1.join)(_config_1.post_generated_dir, 'tag-sitemap.xml'), buildXML).then(function (f) {
        console.log(f);
        if (typeof done == 'function')
            done();
    });
}
/**
 * generate posts and pages sitemap
 * @param done
 */
function generatePages(done) {
    var sourceIndexXML = (0, filemanager_1.join)(__dirname, 'views/post-sitemap.xml');
    var readXML = (0, filemanager_1.read)(sourceIndexXML, 'utf-8');
    var posts = [];
    var pages = [];
    allPosts
        .then(function (posts) {
        return posts.sort(date_1.sortByDate);
    })
        .each(function (post) {
        var lastmod = (0, moment_1.default)(post.metadata.updated).format('YYYY-MM-DDTHH:mm:ssZ');
        var str;
        if (post.metadata.type == 'post') {
            str = "<url><loc>".concat(post.metadata.url, "</loc><lastmod>").concat(lastmod, "</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>");
            posts.push(str);
        }
        else {
            str = "<url><loc>".concat(post.metadata.url, "</loc><lastmod>").concat(lastmod, "</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>");
            pages.push(str);
        }
    })
        .finally(function () {
        var buildXML = readXML.replace(/<url>+[\s\S\n]*<\/url>/gm, posts.join('\n'));
        (0, filemanager_1.write)((0, filemanager_1.join)(_config_1.post_generated_dir, 'post-sitemap.xml'), buildXML).then(function (f) {
            console.log(logname, f);
            buildXML = readXML.replace(/<url>+[\s\S\n]*<\/url>/gm, pages.join('\n'));
            (0, filemanager_1.write)((0, filemanager_1.join)(_config_1.post_generated_dir, 'page-sitemap.xml'), buildXML).then(function (f) {
                console.log(logname, f);
                if (typeof done == 'function')
                    done();
            });
        });
    });
}
/**
 * generated sitemap index
 * @see {@link https://yoast.com/sitemap_index.xml}
 * @param done
 */
function generateIndex(done) {
    return __awaiter(this, void 0, void 0, function () {
        var sourceIndexXML, readXML, latestTag, latestCat, latestPost, latestPage, buildStr, buildXML;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceIndexXML = (0, filemanager_1.join)(__dirname, 'views/sitemap.xml');
                    readXML = (0, filemanager_1.read)(sourceIndexXML, 'utf-8');
                    return [4 /*yield*/, allPosts
                            .map(function (item) {
                            if (item.metadata.tags && item.metadata.tags.length) {
                                if (item.metadata.updated)
                                    return (0, moment_1.default)(item.metadata.updated);
                                if (item.metadata.date)
                                    return (0, moment_1.default)(item.metadata.date);
                            }
                        })
                            .then(date_1.getLatestDateArray)
                            .then(function (date) {
                            return "<sitemap><loc>".concat(_config_1.default.url.replace(/\/+$/, ''), "/tag-sitemap.xml</loc><lastmod>").concat(date, "</lastmod></sitemap>");
                        })];
                case 1:
                    latestTag = _a.sent();
                    return [4 /*yield*/, allPosts
                            .map(function (item) {
                            if (item.metadata.category && item.metadata.category.length) {
                                if (item.metadata.updated)
                                    return (0, moment_1.default)(item.metadata.updated);
                                if (item.metadata.date)
                                    return (0, moment_1.default)(item.metadata.date);
                            }
                        })
                            .then(date_1.getLatestDateArray)
                            .then(function (date) {
                            return "<sitemap><loc>".concat(_config_1.default.url.replace(/\/+$/, ''), "/category-sitemap.xml</loc><lastmod>").concat(date, "</lastmod></sitemap>");
                        })];
                case 2:
                    latestCat = _a.sent();
                    return [4 /*yield*/, allPosts
                            .map(function (item) {
                            if (item.metadata.type && item.metadata.type == 'post') {
                                if (item.metadata.updated)
                                    return (0, moment_1.default)(item.metadata.updated);
                                if (item.metadata.date)
                                    return (0, moment_1.default)(item.metadata.date);
                            }
                        })
                            .then(date_1.getLatestDateArray)
                            .then(function (date) {
                            return "<sitemap><loc>".concat(_config_1.default.url.replace(/\/+$/, ''), "/post-sitemap.xml</loc><lastmod>").concat(date, "</lastmod></sitemap>");
                        })];
                case 3:
                    latestPost = _a.sent();
                    return [4 /*yield*/, allPosts
                            .map(function (item) {
                            if (item.metadata.type && item.metadata.type == 'page') {
                                if (item.metadata.updated)
                                    return (0, moment_1.default)(item.metadata.updated);
                                if (item.metadata.date)
                                    return (0, moment_1.default)(item.metadata.date);
                            }
                        })
                            .then(date_1.getLatestDateArray)
                            .then(function (date) {
                            // if no page exist, return latest post date
                            if (!date)
                                return latestPost.replace('post-sitemap.xml', 'page-sitemap.xml');
                            return "<sitemap><loc>".concat(_config_1.default.url.replace(/\/+$/, ''), "/page-sitemap.xml</loc><lastmod>").concat(date, "</lastmod></sitemap>");
                        })];
                case 4:
                    latestPage = _a.sent();
                    buildStr = [latestTag, latestCat, latestPost, latestPage];
                    buildXML = readXML.replace(/<sitemap>+[\s\S\n]*<\/sitemap>/gm, buildStr.join('\n'));
                    (0, filemanager_1.write)((0, filemanager_1.join)(_config_1.post_generated_dir, 'sitemap.xml'), buildXML).then(function (f) {
                        console.log(logname, f);
                        if (typeof done == 'function')
                            done();
                    });
                    return [2 /*return*/];
            }
        });
    });
}
gulp_1.default.task('generate:sitemap-xml', gulp_1.default.series(copy, generateIndex, generatePages));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9zaXRlbWFwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBZ0M7QUFDaEMsZ0RBQTBCO0FBQzFCLDhDQUF3QjtBQUN4QixrREFBNEI7QUFFNUIsdURBQXVEO0FBQ3ZELHlEQUE4RDtBQUU5RCwwREFHMkM7QUFDM0MsZ0VBQW9FO0FBRXBFLCtDQUErQztBQUMvQyxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JELElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckM7O0dBRUc7QUFDSCxJQUFNLFFBQVEsR0FBMEMsRUFBRSxDQUFDO0FBQzNEOztHQUVHO0FBQ0gsSUFBTSxRQUFRLEdBQTBDLEVBQUUsQ0FBQztBQUMzRDs7R0FFRztBQUNILElBQU0sUUFBUSxHQUFHLENBQUM7SUFDaEIsSUFBSTtRQUNGLE9BQU8sQ0FDTCxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFBLHdCQUFXLEdBQUUsQ0FBQzthQUN4QixHQUFHLENBQUMsVUFBQyxJQUFJO1lBQ1IsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTztZQUNsQixJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRO2dCQUFFLE9BQU87WUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDbkQsSUFBSSxJQUFJLENBQUMsUUFBUTtvQkFDZixJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksUUFBUTt3QkFDekMsSUFBSSxDQUFD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