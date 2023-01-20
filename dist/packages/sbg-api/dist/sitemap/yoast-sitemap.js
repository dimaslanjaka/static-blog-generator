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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yoastSitemapIndex = exports.yoastSeo = exports.yoastSeoSitemap = exports.getPageData = void 0;
var fs_1 = require("fs");
var hexo_is_1 = __importDefault(require("hexo-is"));
var moment_1 = __importDefault(require("moment"));
require("nodejs-package-types");
var path_1 = require("path");
var sbg_utility_1 = require("sbg-utility");
var xmlbuilder2_1 = require("xmlbuilder2");
var archive_1 = __importStar(require("./archive"));
var pages_1 = __importDefault(require("./pages"));
var posts_1 = __importDefault(require("./posts"));
var _log = typeof hexo !== 'undefined' ? hexo.log : console;
var sitemapGroup = {};
function initSitemap(type) {
    if (!sitemapGroup[type]) {
        var sourceXML = (0, path_1.join)(__dirname, 'views/' + type + '-sitemap.xml');
        if (!(0, fs_1.existsSync)(sourceXML))
            throw 'Source ' + sourceXML + ' Not Found';
        var doc = (0, xmlbuilder2_1.create)((0, fs_1.readFileSync)(sourceXML).toString());
        sitemapGroup[type] = new Object(doc.end({ format: 'object' }));
        sitemapGroup[type].urlset.url = [];
    }
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
function getPageData(data) {
    var is = (0, hexo_is_1.default)(data);
    if (data['page']) {
        var page = data['page'];
        page.is = is;
        return page;
    }
}
exports.getPageData = getPageData;
/**
 * init each sitemap
 * @param hexo
 */
function initEachSitemap(hexo) {
    var groups = ['post', 'page', 'category', 'tag'];
    groups.forEach(function (group) {
        if (!sitemapGroup[group])
            initSitemap(group);
        if (sitemapGroup[group].urlset.url.length === 0) {
            sitemapGroup[group].urlset.url.push({
                loc: hexo.config.url,
                lastmod: (0, moment_1.default)(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
                priority: '1',
                changefreq: 'daily'
            });
        }
    });
}
var categoryTagsInfo;
var postUpdateDates = [];
var pageUpdateDates = [];
// const cache = new CacheFile("sitemap");
var turnError = false;
function yoastSeoSitemap(data) {
    var HSconfig = (0, sbg_utility_1.getConfig)();
    if (!HSconfig.sitemap) {
        if (!turnError) {
            turnError = true;
            _log.error('[hexo-seo][sitemap] config sitemap not set');
        }
        return;
    }
    // set category and tag information of posts
    if (!categoryTagsInfo) {
        categoryTagsInfo = (0, archive_1.default)(hexo);
    }
    // cast locals
    var locals = hexo.locals;
    // return if posts and pages empty
    if (['posts', 'pages'].every(function (info) { return locals.get(info).length === 0; })) {
        return;
    }
    var post = getPageData(data);
    if (post) {
        var isPagePost = post.is.post || post.is.page;
        if (isPagePost) {
            // if post updated not found, get source file last modified time
            if (!post.updated) {
                var stats = (0, fs_1.statSync)(post.full_source);
                post.updated = (0, moment_1.default)(stats.mtime);
            }
        }
        if (post.is.post && post.updated) {
            postUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
            sitemapGroup['post'].urlset.url.push({
                loc: post.permalink,
                lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
                changefreq: 'weekly',
                priority: '0.6'
            });
        }
        else if (post.is.page && post.updated) {
            pageUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
            sitemapGroup['page'].urlset.url.push({
                loc: post.permalink,
                lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
                changefreq: 'weekly',
                priority: '0.8'
            });
        }
        if (isPagePost) {
            sbg_utility_1.scheduler.add('writeSitemap', function () {
                // copy xsl
                var destXSL = (0, path_1.join)(hexo.public_dir, 'sitemap.xsl');
                if (!(0, fs_1.existsSync)((0, path_1.dirname)(destXSL)))
                    (0, fs_1.mkdirSync)((0, path_1.dirname)(destXSL), { recursive: true });
                var sourceXSL = (0, path_1.join)(__dirname, 'views/sitemap.xsl');
                if ((0, fs_1.existsSync)(sourceXSL)) {
                    (0, fs_1.copyFileSync)(sourceXSL, destXSL);
                    _log.info('XSL sitemap copied to ' + destXSL);
                }
                else {
                    _log.error('XSL sitemap not found');
                }
                var destPostSitemap = (0, path_1.join)(hexo.public_dir, 'post-sitemap.xml');
                (0, sbg_utility_1.writefile)(destPostSitemap, (0, xmlbuilder2_1.create)(sitemapGroup['post']).end({ prettyPrint: true }));
                _log.info('post sitemap saved', destPostSitemap);
                var destPageSitemap = (0, path_1.join)(hexo.public_dir, 'page-sitemap.xml');
                (0, sbg_utility_1.writefile)(destPageSitemap, (0, xmlbuilder2_1.create)(sitemapGroup['page']).end({ prettyPrint: true }));
                _log.info('page sitemap saved', destPageSitemap);
                yoastSitemapIndex(hexo);
            });
        }
    }
}
exports.yoastSeoSitemap = yoastSeoSitemap;
/**
 * yoast seo sitemap builder
 * @param hexo
 */
function yoastSeo(hexo) {
    initEachSitemap(hexo);
    var locals = hexo.locals;
    var emptySite = ['posts', 'pages'].every(function (info) { return locals.get(info).length === 0; });
    if (emptySite)
        return;
    // yoastSitemapIndex(hexo);
    (0, pages_1.default)(hexo);
    (0, posts_1.default)(hexo);
}
exports.yoastSeo = yoastSeo;
/**
 * generate yoast
 * * path /sitemap.xml
 * @param hexo
 */
function yoastSitemapIndex(hexo) {
    var sourceIndexXML = (0, path_1.join)(__dirname, 'views/sitemap.xml');
    var sitemapIndexDoc = (0, xmlbuilder2_1.create)((0, fs_1.readFileSync)(sourceIndexXML).toString());
    var sitemapIndex = new Object(sitemapIndexDoc.end({ format: 'object' }));
    sitemapIndex.sitemapindex.sitemap = [];
    // push post-sitemap.xml to sitemapindex
    var latestPostDate = (0, archive_1.getLatestFromArrayDates)(postUpdateDates);
    _log.info('latest updated post', latestPostDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/post-sitemap.xml',
        lastmod: (0, moment_1.default)(latestPostDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    // push page-sitemap.xml to sitemapindex
    var latestPageDate = (0, archive_1.getLatestFromArrayDates)(pageUpdateDates);
    _log.info('latest updated page', latestPageDate);
    if ((0, moment_1.default)(latestPageDate).isValid())
        sitemapIndex.sitemapindex.sitemap.push({
            loc: hexo.config.url.toString() + '/page-sitemap.xml',
            lastmod: (0, moment_1.default)(latestPageDate).format('YYYY-MM-DDTHH:mm:ssZ')
        });
    // set category and tag information of posts
    if (!categoryTagsInfo) {
        categoryTagsInfo = (0, archive_1.default)(hexo);
    }
    // build tag-sitemap.xml
    var tags = categoryTagsInfo.tags;
    tags.map(function (tag) {
        sitemapGroup['tag'].urlset.url.push({
            loc: tag.permalink.toString(),
            // set latest post updated from this tag
            lastmod: (0, moment_1.default)(tag.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
            changefreq: 'weekly',
            priority: '0.2'
        });
    });
    var destTagSitemap = (0, path_1.join)(hexo.public_dir, 'tag-sitemap.xml');
    (0, sbg_utility_1.writefile)(destTagSitemap, (0, xmlbuilder2_1.create)(sitemapGroup['tag']).end({ prettyPrint: true }));
    _log.info('tag sitemap saved', destTagSitemap);
    // push tag-sitemap.xml to sitemapindex
    var latestTagDate = (0, archive_1.getLatestFromArrayDates)(tags.map(function (tag) {
        return tag.latest;
    }));
    _log.info('latest updated tag', latestTagDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/tag-sitemap.xml',
        lastmod: (0, moment_1.default)(latestTagDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    // build category-sitemap.xml
    var categories = categoryTagsInfo.categories;
    categories.map(function (category) {
        sitemapGroup['category'].urlset.url.push({
            loc: category.permalink.toString(),
            // set latest post updated from this tag
            lastmod: (0, moment_1.default)(category.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
            changefreq: 'weekly',
            priority: '0.2'
        });
    });
    var destCategorySitemap = (0, path_1.join)(hexo.public_dir, 'category-sitemap.xml');
    (0, sbg_utility_1.writefile)(destCategorySitemap, (0, xmlbuilder2_1.create)(sitemapGroup['category']).end({ prettyPrint: true }));
    _log.info('category sitemap saved', destCategorySitemap);
    // push category-sitemap.xml to sitemapindex
    var latestCategoryDate = (0, archive_1.getLatestFromArrayDates)(categories.map(function (category) {
        return category.latest;
    }));
    _log.info('latest updated category', latestCategoryDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/category-sitemap.xml',
        lastmod: (0, moment_1.default)(latestCategoryDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    var destIndexSitemap = (0, path_1.join)(hexo.public_dir, 'sitemap.xml');
    (0, sbg_utility_1.writefile)(destIndexSitemap, (0, xmlbuilder2_1.create)(sitemapIndex).end({ prettyPrint: true }));
    _log.info('index sitemap saved', destIndexSitemap);
}
exports.yoastSitemapIndex = yoastSitemapIndex;
//# sourceMappingURL=yoast-sitemap.js.map