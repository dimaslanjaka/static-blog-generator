"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteMapCrawler = exports.sitemapCrawlerAsync = exports.sitemapCrawler = void 0;
const tslib_1 = require("tslib");
const siteMap = tslib_1.__importStar(require("./sitemap"));
//module 'sitemap-crawler'
var sitemap_1 = require("./sitemap");
Object.defineProperty(exports, "sitemapCrawler", { enumerable: true, get: function () { return sitemap_1.sitemapCrawler; } });
Object.defineProperty(exports, "sitemapCrawlerAsync", { enumerable: true, get: function () { return sitemap_1.sitemapCrawlerAsync; } });
Object.defineProperty(exports, "SiteMapCrawler", { enumerable: true, get: function () { return sitemap_1.SiteMapCrawlerCore; } });
exports.default = siteMap.sitemapCrawler;
