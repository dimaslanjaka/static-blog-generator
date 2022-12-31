"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllpageUpdateDates = void 0;
var tslib_1 = require("tslib");
var bluebird_1 = tslib_1.__importDefault(require("bluebird"));
var moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
var path_1 = require("path");
var xmlbuilder2_1 = require("xmlbuilder2");
var fm_1 = require("../utils/fm");
var pageUpdateDates = [];
var _log = typeof hexo !== 'undefined' ? hexo.log : console;
var sitemapPagesList = [];
function yoastSeoSitemapPages(hexo) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var destSitemap;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, bluebird_1.default.all(hexo.locals.get('pages').toArray()).each(function (data) {
                        var _a;
                        var lastmod = ((_a = data.updated) === null || _a === void 0 ? void 0 : _a.format('YYYY-MM-DDTHH:mm:ssZ')) || (0, moment_timezone_1.default)().format();
                        pageUpdateDates.push(lastmod);
                        var info = {
                            loc: data.permalink,
                            lastmod: lastmod,
                            changefreq: 'weekly',
                            priority: '0.8'
                        };
                        sitemapPagesList.push(info);
                    })];
                case 1:
                    _a.sent();
                    destSitemap = (0, path_1.join)(hexo.public_dir, 'page-sitemap.xml');
                    (0, fm_1.writefile)(destSitemap, (0, xmlbuilder2_1.create)({
                        urlset: {
                            url: sitemapPagesList
                        }
                    }).end({ prettyPrint: true }));
                    _log.info('page sitemap saved', destSitemap);
                    return [2];
            }
        });
    });
}
exports.default = yoastSeoSitemapPages;
function getAllpageUpdateDates() {
    return pageUpdateDates;
}
exports.getAllpageUpdateDates = getAllpageUpdateDates;
