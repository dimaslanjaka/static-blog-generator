"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sitemapAsync = void 0;
const tslib_1 = require("tslib");
const async_1 = tslib_1.__importDefault(require("async"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const cheerio_1 = tslib_1.__importDefault(require("cheerio"));
const progress_1 = tslib_1.__importDefault(require("progress"));
const request_1 = tslib_1.__importDefault(require("request"));
class SiteMapCrawler {
    static start(links, isProgress, isLog, isCounting, callback) {
        const siteMap = {};
        let bar;
        if (isProgress) {
            bar = new progress_1.default('siteMap-crawling [:bar] :percent', {
                total: links.length
            });
        }
        async_1.default.each(links, (link, callback) => {
            const done = () => {
                if (isProgress) {
                    bar.tick();
                }
                callback();
            };
            (0, request_1.default)(link, (err, res, body) => {
                if (err) {
                    if (isLog) {
                        const { errno, code, syscall, host } = err;
                        console.log(`\nError: ${errno} ${code} ${syscall}, ${host}`);
                    }
                    return done();
                }
                const $ = cheerio_1.default.load(body);
                const hrefs = $('[href]');
                const filteredLinks = new Set();
                hrefs.each((i) => {
                    var _a;
                    const href = (_a = this.filterLink(link, hrefs.eq(i).attr('href') || '')) === null || _a === void 0 ? void 0 : _a.trim();
                    if (typeof href === 'string' && href.length > 0) {
                        filteredLinks.add(href);
                    }
                });
                const arrayLinks = Array.from(filteredLinks).map((url) => {
                    if (url.endsWith('/')) {
                        // url ends with. / -> /index.html
                        url += 'index.html';
                    }
                    else if (!/(\w+\.\w+)$/.test(url)) {
                        // url doesnt have extension. /path -> /path/index.html
                        url += '/index.html';
                    }
                    return url;
                });
                if (arrayLinks.length > 0) {
                    siteMap[link] = arrayLinks;
                }
                return done();
            });
        }, (err) => {
            if (err) {
                return callback(err);
            }
            const count = Object.keys(siteMap).length;
            const siteMapObj = isCounting
                ? { count, siteMap }
                : siteMap[links];
            callback(null, siteMapObj);
        });
    }
    static filterLink(parent, href) {
        const ignores = [
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
        const rIgnores = new RegExp(ignores.join('|'), 'i');
        if (isValidHttpUrl(href)) {
            const parentHostName = new URL(parent).hostname;
            const hrefHostName = new URL(href).hostname;
            if (parentHostName === hrefHostName && !href.match(rIgnores)) {
                return href;
            }
        }
        if (!href.match(rIgnores) && !href.includes('//')) {
            const resolvedUrl = String(new URL(parent + href));
            //console.log(parent, href, resolvedUrl);
            return resolvedUrl;
        }
        return null;
    }
}
const attachProtocol = (link) => {
    if (!link.startsWith('http')) {
        return 'http://' + link;
    }
    return link;
};
const siteMap = (link, opts, callback) => {
    let isProgress = false, isLog = false, isCounting = true;
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
        link = link.map((l) => {
            return attachProtocol(l);
        });
    }
    SiteMapCrawler.start(link, isProgress, isLog, isCounting, callback || noop);
};
function sitemapAsync(link, opts) {
    return new bluebird_1.default((resolve) => {
        const results = [];
        const crawl = (url) => {
            siteMap(url, opts, function (e, links) {
                if (!e) {
                    console.log(links);
                }
            });
        };
        if (typeof link === 'string')
            crawl(link);
    });
}
exports.sitemapAsync = sitemapAsync;
exports.default = siteMap;
function noop() {
    //
}
function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    }
    catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}
