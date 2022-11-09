"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSitemap = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var fs_extra_1 = require("fs-extra");
var gulp_1 = __importDefault(require("gulp"));
var sitemap_crawler_1 = require("sitemap-crawler");
var upath_1 = require("upath");
var gulp_deploy_1 = require("./gulp.deploy");
var array_1 = require("./utils/array");
function generateSitemap() {
    return new bluebird_1.default(function (resolve) {
        var deployDir = (0, gulp_deploy_1.deployConfig)().deployDir;
        var originfile = (0, upath_1.join)(process.cwd(), 'public/sitemap.txt');
        var outfile = (0, upath_1.join)(deployDir, 'sitemap.txt');
        var sitemaps = (0, fs_extra_1.readFileSync)(originfile, 'utf-8').split(/\r?\n/gm);
        bluebird_1.default.all([
            (0, sitemap_crawler_1.sitemapCrawlerAsync)('https://www.webmanajemen.com/chimeraland', {
                deep: 2
            }),
            (0, sitemap_crawler_1.sitemapCrawlerAsync)('https://www.webmanajemen.com', {
                deep: 2
            })
        ]).then(function (results) {
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
            (0, fs_extra_1.writeFileSync)(saveto, JSON.stringify(mapped, null, 2));
        });
        (0, sitemap_crawler_1.sitemapCrawlerAsync)('https://www.webmanajemen.com', {
            deep: 2
        })
            .then(function (results) {
            return new bluebird_1.default(function (resolve) {
                (0, sitemap_crawler_1.sitemapCrawlerAsync)('https://www.webmanajemen.com/chimeraland', {
                    deep: 2
                }).then(function (chimera) {
                    resolve(Object.assign(chimera, results));
                });
            });
        })
            .then(function (results) {
            sitemaps = Object.values(results)
                .flat(1)
                .concat(sitemaps)
                .filter(function (x, i, a) {
                return a.indexOf(x) === i && typeof x == 'string' && x.length > 0;
            })
                .sort(function (a, b) {
                return a === b ? 0 : a < b ? -1 : 1;
            });
            (0, fs_extra_1.writeFile)(outfile, sitemaps.join('\n'), resolve);
        });
    });
}
exports.generateSitemap = generateSitemap;
gulp_1.default.task('sitemap', generateSitemap);
