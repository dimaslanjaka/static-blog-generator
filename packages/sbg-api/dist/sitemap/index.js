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
exports.hexoGenerateSitemap = exports.generateSitemap = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var fs_extra_1 = require("fs-extra");
var gulp_1 = __importDefault(require("gulp"));
var gulp_dom_1 = __importDefault(require("gulp-dom"));
var hexo_1 = __importDefault(require("hexo"));
var hexo_util_1 = require("hexo-util");
var micromatch_1 = __importDefault(require("micromatch"));
var nunjucks_1 = __importDefault(require("nunjucks"));
var sbg_utility_1 = require("sbg-utility");
var sitemap_crawler_1 = require("sitemap-crawler");
var upath_1 = require("upath");
var yoast_sitemap_1 = require("./yoast-sitemap");
/*
// read existing sitemap.txt
const sitemapTXT = join(getConfig().cwd, getConfig().public_dir || 'public', 'sitemap.txt');
let sitemaps = existsSync(sitemapTXT) ? array_remove_empty(readFileSync(sitemapTXT, 'utf-8').split(/\r?\n/gm)) : [];
*/
var sitemaps = [];
var crawled = new Set();
var env = (0, sbg_utility_1.envNunjucks)();
/**
 * Sitemap Generator
 * @param url url to crawl
 * @param deep crawl deeper n times
 * @returns
 */
function generateSitemap(url, deep) {
    var _this = this;
    if (deep === void 0) { deep = 0; }
    return new bluebird_1.default(function (resolve) {
        var promises = [];
        if (typeof url === 'string') {
            crawled.add(url);
            promises.push((0, sitemap_crawler_1.sitemapCrawlerAsync)(url, {
                deep: deep
            }));
        }
        else {
            crawled.add((0, sbg_utility_1.getConfig)().url);
            promises.push((0, sitemap_crawler_1.sitemapCrawlerAsync)((0, sbg_utility_1.getConfig)().url, {
                deep: deep
            }));
        }
        bluebird_1.default.all(promises)
            .then(function (results) {
            var mapped = {};
            results.forEach(function (sitemap) {
                for (var key in sitemap) {
                    var values = sitemap[key];
                    if (key in mapped === false) {
                        mapped[key] = values;
                    }
                    else {
                        mapped[key] = (0, sbg_utility_1.array_unique)(values.concat(mapped[key]));
                    }
                }
            });
            // dump
            var saveto = (0, upath_1.join)((0, sbg_utility_1.getConfig)().cwd, 'tmp/dump/sitemap/sitemap.json');
            (0, sbg_utility_1.writefile)(saveto, JSON.stringify(mapped, null, 2));
            // return
            return mapped;
        })
            .then(function (results) { return __awaiter(_this, void 0, void 0, function () {
            var i, ii, url_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sitemaps = (0, sbg_utility_1.array_unique)((0, sbg_utility_1.array_remove_empty)(Object.values(results).flat(1).concat(sitemaps))).sort(function (a, b) {
                            return a === b ? 0 : a < b ? -1 : 1;
                        });
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < deep)) return [3 /*break*/, 6];
                        ii = 0;
                        _a.label = 2;
                    case 2:
                        if (!(ii < sitemaps.length)) return [3 /*break*/, 5];
                        url_1 = sitemaps[ii];
                        if (crawled.has(url_1) || /.(js|ts|css|scss|txt|pdf|png|jpe?g|gif|webp)$/gi.test(url_1))
                            return [3 /*break*/, 4];
                        crawled.add(url_1);
                        sbg_utility_1.Logger.log('[depth]', ii, url_1);
                        return [4 /*yield*/, generateSitemap(url_1, deep).then(function () { return writeSitemap(); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        ii++;
                        return [3 /*break*/, 2];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6:
                        writeSitemap(resolve);
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
exports.generateSitemap = generateSitemap;
/**
 * write the sitemap
 * @param callback
 */
function writeSitemap(callback) {
    var cb = sbg_utility_1.noop;
    if (callback)
        cb = function () { return callback(sitemaps); };
    var sitemapTXT = (0, upath_1.join)((0, sbg_utility_1.getConfig)().cwd, (0, sbg_utility_1.getConfig)().public_dir || 'public', 'sitemap.txt');
    (0, sbg_utility_1.writefile)(sitemapTXT, (0, sbg_utility_1.array_remove_empty)(sitemaps).join('\n'));
    cb.apply(this);
}
function hexoGenerateSitemap() {
    return new bluebird_1.default(function (resolve) {
        var instance = new hexo_1.default((0, sbg_utility_1.getConfig)().cwd);
        instance.init().then(function () {
            instance.load().then(function () {
                env.addFilter('formatUrl', function (str) {
                    return hexo_util_1.full_url_for.call(instance, str);
                });
                var config = (0, sbg_utility_1.setConfig)(instance.config);
                // assign default config
                var sitemap = Object.assign({ rel: false, tags: false, categories: false, path: ['sitemap.txt', 'sitemap.xml'] }, config.sitemap);
                // Build Yoast SEO sitemap
                // when config.yoast defined
                if (sitemap.yoast) {
                    return (0, yoast_sitemap_1.yoastSeo)(instance);
                }
                if (!config.sitemap)
                    return sbg_utility_1.Logger.log('[sitemap] config.sitemap not configured in _config.yml');
                var locals = instance.locals;
                var skip_render = config.skip_render;
                if (!sitemap.tags || !sitemap.categories) {
                    return sbg_utility_1.Logger.log('[sitemap] config.sitemap.tags or config.sitemap.categories not configured in _config.yml');
                }
                var skipRenderList = ['**/*.js', '**/*.css', '**/.git*'];
                if (Array.isArray(skip_render)) {
                    skipRenderList.push.apply(skipRenderList, __spreadArray([], __read(skip_render), false));
                }
                else if (typeof skip_render === 'string') {
                    if (skip_render.length > 0) {
                        skipRenderList.push(skip_render);
                    }
                }
                var posts = __spreadArray(__spreadArray([], __read(locals.get('pages').toArray()), false), __read(locals.get('posts').toArray()), false).filter(function (post) {
                    return post.sitemap !== false && !isMatch(post.source, skipRenderList);
                })
                    .sort(function (a, b) {
                    if (b.updated && a.updated)
                        return b.updated.toDate().getTime() - a.updated.toDate().getTime();
                    return 0;
                });
                if (posts.length <= 0) {
                    return resolve();
                }
                var tmplSrc = (0, upath_1.join)(__dirname, '_config_template_sitemap.xml');
                var template = nunjucks_1.default.compile((0, fs_extra_1.readFileSync)(tmplSrc, 'utf-8'), env);
                var tagsCfg = sitemap.tags, catsCfg = sitemap.categories, relCfg = sitemap.rel;
                var data = template.render({
                    config: config,
                    posts: posts,
                    sNow: new Date(),
                    tags: tagsCfg ? locals.get('tags').toArray() : [],
                    categories: catsCfg ? locals.get('categories').toArray() : []
                });
                // remove blank newlines
                data = data.replace(/^\s*[\r\n]/gm, '\n');
                //data = prettier.format(data, { parser: 'xml', plugins: [xmlplugin], endOfLine: 'lf' });
                // dump
                (0, sbg_utility_1.writefile)((0, upath_1.join)(config.cwd, 'tmp/dump/sitemap/sitemap.xml'), data);
                // write
                var sitemapXml = (0, upath_1.join)((0, sbg_utility_1.getConfig)().cwd, config.public_dir, 'sitemap.xml');
                (0, sbg_utility_1.writefile)(sitemapXml, data);
                instance.log.info('sitemap written', sitemapXml);
                if (!relCfg)
                    return resolve();
                var baseURL = config.url.endsWith('/') ? config.url : config.url + '/';
                var publicDir = (0, upath_1.join)((0, sbg_utility_1.getConfig)().cwd, config.public_dir);
                gulp_1.default
                    .src('**/*.html', { cwd: publicDir, ignore: sbg_utility_1.commonIgnore })
                    .pipe((0, gulp_dom_1.default)(function () {
                    // auto discovery sitemap
                    if (this.querySelectorAll("link[href=\"".concat(baseURL, "sitemap.xml\"]")).length === 0 &&
                        this.querySelectorAll("link[href=\"/sitemap.xml\"]").length === 0) {
                        this.head.innerHTML += "<link id=\"sitemap-site-url\" type=\"application/text+xml\" rel=\"sitemap\" href=\"".concat(baseURL, "sitemap.xml\" />");
                    }
                    //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
                }))
                    .pipe(gulp_1.default.dest(publicDir))
                    .once('end', function () { return resolve(); });
            });
        });
    });
}
exports.hexoGenerateSitemap = hexoGenerateSitemap;
/**
 * is string matched pattern (using micromatch)
 * @param str
 * @param patterns
 * @returns
 */
function isMatch(str, patterns) {
    return micromatch_1.default.isMatch(str, patterns);
}
gulp_1.default.task('sitemap', function () {
    return new bluebird_1.default(function (resolve) {
        hexoGenerateSitemap().then(function () {
            resolve();
        });
    });
});
//# sourceMappingURL=index.js.map