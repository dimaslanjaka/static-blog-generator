"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sitemapCrawlerAsync = exports.sitemapCrawler = exports.SiteMapCrawlerCore = void 0;
var tslib_1 = require("tslib");
var async_1 = tslib_1.__importDefault(require("async"));
var bluebird_1 = tslib_1.__importDefault(require("bluebird"));
var cheerio_1 = tslib_1.__importDefault(require("cheerio"));
var progress_1 = tslib_1.__importDefault(require("progress"));
var request_1 = tslib_1.__importDefault(require("request"));
var utils_1 = require("../utils");
var SiteMapCrawlerCore = /** @class */ (function () {
    function SiteMapCrawlerCore() {
    }
    SiteMapCrawlerCore.start = function (links, core_opt, isCounting, callback) {
        var _this = this;
        var isProgress = core_opt.isProgress, isLog = core_opt.isLog;
        var siteMap = {};
        var bar;
        if (isProgress) {
            bar = new progress_1.default('siteMap-crawling [:bar] :percent', {
                total: links.length
            });
        }
        async_1.default.each(links, function (link, callback) {
            var done = function () {
                if (isProgress) {
                    bar.tick();
                }
                callback();
            };
            var self = _this;
            (0, request_1.default)(link, function (err, res, body) {
                if (err) {
                    if (isLog) {
                        var errno = err.errno, code = err.code, syscall = err.syscall, host = err.host;
                        console.log("\nError: ".concat(errno, " ").concat(code, " ").concat(syscall, ", ").concat(host));
                    }
                    return done();
                }
                try {
                    var $ = cheerio_1.default.load(body);
                    var hrefs_1 = $('[href]');
                    var filteredLinks_1 = new Set();
                    hrefs_1.each(function (i) {
                        var _a, _b;
                        if (((_a = hrefs_1.eq(i).get(0)) === null || _a === void 0 ? void 0 : _a.tagName.toLowerCase()) !== 'a') {
                            var href_1 = hrefs_1.eq(i).attr('href');
                            if (!href_1 || !/(\/|.html)$/gi.test(href_1))
                                return;
                        }
                        var href = (_b = self.filterLink(link, hrefs_1.eq(i).attr('href') || '')) === null || _b === void 0 ? void 0 : _b.trim();
                        if (typeof href === 'string' && href.length > 0) {
                            var dirUrl = link.substring(0, link.lastIndexOf('/'));
                            if (/^https?:\/\//i.test(href.trim())) {
                                filteredLinks_1.add(href);
                            }
                            else {
                                filteredLinks_1.add(dirUrl + '/' + href);
                            }
                        }
                    });
                    var arrayLinks = Array.from(filteredLinks_1).map(function (url) {
                        if (url.endsWith('/')) {
                            // url ends with. / -> /index.html
                            url += 'index.html';
                        }
                        else if (!/(\w+\.\w+)$/.test(url)) {
                            // url doesnt have extension. /path -> /path/index.html
                            url += '/index.html';
                        }
                        if (!core_opt.keepQuery)
                            return url.split('?')[0];
                        return url;
                    });
                    if (arrayLinks.length > 0) {
                        siteMap[link] = arrayLinks;
                    }
                }
                catch (_a) {
                    console.log('sitemap-crawler', 'cannot parse', link);
                }
                return done();
            });
        }, function (err) {
            if (err) {
                return callback(err);
            }
            var count = Object.keys(siteMap).length;
            var siteMapObj = isCounting ? { count: count, siteMap: siteMap } : siteMap[links];
            callback(null, siteMapObj);
        });
    };
    SiteMapCrawlerCore.filterLink = function (parent, href) {
        var ignores = [
            '^javascript',
            'css',
            'ico',
            '#',
            '^/$',
            '^#none$',
            '^$',
            '@',
            'png',
            'svg',
            'manifest.json',
            'pdf$',
            '^tel',
            '^sms',
            '^mailto',
            'admin',
            'login',
            'register'
        ];
        var rIgnores = new RegExp(ignores.join('|'), 'i');
        if (isValidHttpUrl(href)) {
            var parentHostName = new URL(parent).hostname;
            var hrefHostName = new URL(href).hostname;
            if (parentHostName === hrefHostName && !href.match(rIgnores)) {
                return href;
            }
        }
        if (!href.match(rIgnores) && !href.includes('//')) {
            var base = new URL(parent);
            var resolvedUrl = fixUrl([String(new URL(base.origin + '/' + href))])[0];
            //console.log(parent, href, resolvedUrl);
            return resolvedUrl;
        }
        return null;
    };
    return SiteMapCrawlerCore;
}());
exports.SiteMapCrawlerCore = SiteMapCrawlerCore;
/**
 * add protocol
 * @param link
 * @returns empty string when invalid link
 */
function attachProtocol(link) {
    if (link.startsWith('/')) {
        (0, utils_1.debug)('sitemap-crawler')('start with slash', link);
        return '';
    }
    else if (link.startsWith('#')) {
        (0, utils_1.debug)('sitemap-crawler')('start with hash', link);
        return '';
    }
    if (!/^https?:/i.test(link)) {
        return 'http://' + link;
    }
    return link;
}
var sitemapCrawler = function (link, opts, callback) {
    var isProgress = false, isLog = false, isCounting = true;
    opts = Object.assign({ isProgress: false, isLog: false }, opts || {});
    if (typeof opts === 'function') {
        callback = opts;
    }
    else {
        isProgress = opts.isProgress || false;
        isLog = opts.isLog || false;
    }
    if (typeof link === 'string') {
        link = attachProtocol(link);
        link = [link];
        isCounting = false;
    }
    else {
        link = link.map(function (l) {
            return attachProtocol(l);
        });
    }
    SiteMapCrawlerCore.start(link, {
        isProgress: isProgress,
        isLog: isLog
    }, isCounting, callback || noop);
};
exports.sitemapCrawler = sitemapCrawler;
var asyncResults = {};
/**
 * Sitemap Crawler Asynchronous
 * @param link
 * @param opts
 * @returns
 */
function sitemapCrawlerAsync(link, opts) {
    return new bluebird_1.default(function (resolve) {
        // assign with default option
        opts = Object.assign({ deep: 0, isLog: false, keepQuery: false, isProgress: false }, opts || {});
        // crawler
        var crawl = function (url) {
            return new bluebird_1.default(function (resolveCrawl) {
                (0, exports.sitemapCrawler)(url, opts, function (e, links) {
                    if (!e) {
                        var key = new URL(url).origin;
                        // append to asyncResult
                        asyncResults[key] = fixUrl(links || []).concat(asyncResults[key] || []);
                    }
                    else {
                        console.log('err', e);
                    }
                    resolveCrawl(asyncResults);
                });
            });
        };
        var linkArr = [];
        var crawled = [];
        var schedule = function () {
            return new bluebird_1.default(function (resolveSchedule) {
                var url = linkArr.shift();
                if (crawled.includes(url))
                    return resolveSchedule();
                crawled.push(url);
                crawl(url).then(function () {
                    if (linkArr.length > 0) {
                        schedule().then(resolveSchedule);
                    }
                    else {
                        resolveSchedule();
                    }
                });
            });
        };
        if (typeof link === 'string') {
            linkArr.push(link);
        }
        else {
            linkArr = link;
        }
        var deepIterate = function () {
            return new Promise(function (resolveLoop) {
                schedule().then(function () {
                    if (typeof (opts === null || opts === void 0 ? void 0 : opts.deep) === 'number') {
                        if (opts.deep > 0) {
                            opts.deep = opts.deep - 1;
                            linkArr = Object.values(asyncResults).flat(1);
                            deepIterate().then(resolveLoop);
                        }
                        else {
                            resolveLoop(null);
                        }
                    }
                    else {
                        resolveLoop(null);
                    }
                });
            });
        };
        deepIterate().then(function () {
            Object.keys(asyncResults).forEach(function (key) {
                asyncResults[key] = fixUrl(asyncResults[key]);
            });
            resolve(asyncResults);
        });
    });
}
exports.sitemapCrawlerAsync = sitemapCrawlerAsync;
exports.default = exports.sitemapCrawler;
function noop() {
    //
}
function isValidHttpUrl(string) {
    var url;
    try {
        url = new URL(string);
    }
    catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}
function fixUrl(links) {
    return (links
        .map(function (url) {
        //const parse = new URL(url);
        //url = parse.toString();
        // remove double slash from pathname
        url = url.replace(/(https?:\/\/)|(\/)+/gim, '$1$2');
        return url;
    })
        // remove duplicated urls
        .filter(function (x, i, a) {
        return a.indexOf(x) === i;
    })
        // sort alphabetically
        .sort(function (a, b) {
        return a === b ? 0 : a < b ? -1 : 1;
    }));
}
//# sourceMappingURL=sitemap-crawler.js.map