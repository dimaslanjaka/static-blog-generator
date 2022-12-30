"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexoGenerateSitemap = exports.generateSitemap = void 0;
var tslib_1 = require("tslib");
var bluebird_1 = tslib_1.__importDefault(require("bluebird"));
var fs_extra_1 = require("fs-extra");
var gulp_1 = tslib_1.__importDefault(require("gulp"));
var gulp_dom_1 = tslib_1.__importDefault(require("gulp-dom"));
var hexo_1 = tslib_1.__importDefault(require("hexo"));
var hexo_util_1 = require("hexo-util");
var micromatch_1 = tslib_1.__importDefault(require("micromatch"));
var nunjucks_1 = tslib_1.__importDefault(require("nunjucks"));
var os_1 = require("os");
var sitemap_crawler_1 = require("sitemap-crawler");
var upath_1 = require("upath");
var gulp_config_1 = require("./gulp.config");
var array_1 = require("./utils/array");
var fm_1 = require("./utils/fm");
var noop_1 = tslib_1.__importDefault(require("./utils/noop"));
var nunjucks_env_1 = tslib_1.__importDefault(require("./utils/nunjucks-env"));
var sitemapTXT = (0, upath_1.join)((0, gulp_config_1.getConfig)().cwd, (0, gulp_config_1.getConfig)().public_dir || 'public', 'sitemap.txt');
var sitemaps = (0, fs_extra_1.existsSync)(sitemapTXT) ? (0, array_1.array_remove_empty)((0, fs_extra_1.readFileSync)(sitemapTXT, 'utf-8').split(/\r?\n/gm)) : [];
var crawled = new Set();
var env = (0, nunjucks_env_1.default)();
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
            crawled.add((0, gulp_config_1.getConfig)().url);
            promises.push((0, sitemap_crawler_1.sitemapCrawlerAsync)((0, gulp_config_1.getConfig)().url, {
                deep: deep
            }));
        }
        bluebird_1.default.all(promises)
            .then(function (results) {
            var saveto = (0, upath_1.join)(__dirname, '../tmp/sitemap.json');
            (0, fs_extra_1.mkdirpSync)((0, upath_1.dirname)(saveto));
            var mapped = {};
            results.forEach(function (sitemap) {
                for (var key in sitemap) {
                    var values = sitemap[key];
                    if (key in mapped === false) {
                        mapped[key] = values;
                    }
                    else {
                        mapped[key] = (0, array_1.array_unique)(values.concat(mapped[key]));
                    }
                }
            });
            return mapped;
        })
            .then(function (results) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var i, ii, url_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sitemaps = (0, array_1.array_unique)((0, array_1.array_remove_empty)(Object.values(results).flat(1).concat(sitemaps))).sort(function (a, b) {
                            return a === b ? 0 : a < b ? -1 : 1;
                        });
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < deep)) return [3, 6];
                        ii = 0;
                        _a.label = 2;
                    case 2:
                        if (!(ii < sitemaps.length)) return [3, 5];
                        url_1 = sitemaps[ii];
                        if (crawled.has(url_1) || /.(js|ts|css|scss|txt|pdf|png|jpe?g|gif|webp)$/gi.test(url_1))
                            return [3, 4];
                        crawled.add(url_1);
                        console.log('[depth]', ii, url_1);
                        return [4, generateSitemap(url_1, deep).then(function () { return writeSitemap(); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        ii++;
                        return [3, 2];
                    case 5:
                        i++;
                        return [3, 1];
                    case 6:
                        writeSitemap(resolve);
                        return [2];
                }
            });
        }); });
    });
}
exports.generateSitemap = generateSitemap;
function writeSitemap(callback) {
    var cb = noop_1.default;
    if (callback)
        cb = function () { return callback(sitemaps); };
    (0, fm_1.writefile)(sitemapTXT, (0, array_1.array_remove_empty)(sitemaps).join(os_1.EOL));
    cb.apply(this);
}
function hexoGenerateSitemap() {
    return new bluebird_1.default(function (resolve) {
        var instance = new hexo_1.default((0, gulp_config_1.getConfig)().cwd);
        instance.init().then(function () {
            instance.load().then(function () {
                env.addFilter('formatUrl', function (str) {
                    return hexo_util_1.full_url_for.call(instance, str);
                });
                var config = (0, gulp_config_1.setConfig)(instance.config);
                var sitemap = Object.assign({ rel: false, tags: false, categories: false, path: ['sitemap.txt', 'sitemap.xml'] }, config.sitemap);
                if (sitemap.yoast) {
                    return;
                }
                if (!config.sitemap)
                    return console.log('[sitemap] config.sitemap not configured in _config.yml');
                var locals = instance.locals;
                var skip_render = config.skip_render;
                if (!sitemap.tags || !sitemap.categories) {
                    return console.log('[sitemap] config.sitemap.tags or config.sitemap.categories not configured in _config.yml');
                }
                var skipRenderList = ['**/*.js', '**/*.css', '**/.git*'];
                if (Array.isArray(skip_render)) {
                    skipRenderList.push.apply(skipRenderList, tslib_1.__spreadArray([], tslib_1.__read(skip_render), false));
                }
                else if (typeof skip_render === 'string') {
                    if (skip_render.length > 0) {
                        skipRenderList.push(skip_render);
                    }
                }
                var posts = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(locals.get('pages').toArray()), false), tslib_1.__read(locals.get('posts').toArray()), false).filter(function (post) {
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
                data = data.replace(/^\s*[\r\n]/gm, '\n');
                (0, fm_1.writefile)((0, upath_1.join)(__dirname, '../tmp/sitemap.xml'), data);
                var sitemapXml = (0, upath_1.join)((0, gulp_config_1.getConfig)().cwd, config.public_dir, 'sitemap.xml');
                (0, fm_1.writefile)(sitemapXml, data);
                instance.log.info('sitemap written', sitemapXml);
                if (!relCfg)
                    return resolve();
                var baseURL = config.url.endsWith('/') ? config.url : config.url + '/';
                var publicDir = (0, upath_1.join)((0, gulp_config_1.getConfig)().cwd, config.public_dir);
                gulp_1.default
                    .src('**/*.html', { cwd: publicDir, ignore: gulp_config_1.commonIgnore })
                    .pipe((0, gulp_dom_1.default)(function () {
                    if (this.querySelectorAll("link[href=\"".concat(baseURL, "sitemap.xml\"]")).length === 0 &&
                        this.querySelectorAll("link[href=\"/sitemap.xml\"]").length === 0) {
                        this.head.innerHTML += "<link id=\"sitemap-site-url\" type=\"application/text+xml\" rel=\"sitemap\" href=\"".concat(baseURL, "sitemap.xml\" />");
                    }
                }))
                    .pipe(gulp_1.default.dest(publicDir))
                    .once('end', function () { return resolve(); });
            });
        });
    });
}
exports.hexoGenerateSitemap = hexoGenerateSitemap;
function isMatch(path, patterns) {
    return micromatch_1.default.isMatch(path, patterns);
}
gulp_1.default.task('sitemap', function () {
    return new bluebird_1.default(function (resolve) {
        hexoGenerateSitemap().then(function () {
            resolve();
        });
    });
});
