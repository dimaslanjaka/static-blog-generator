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
exports.generateSitemap = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var fs_extra_1 = require("fs-extra");
var gulp_1 = __importDefault(require("gulp"));
var sitemap_crawler_1 = require("sitemap-crawler");
var upath_1 = require("upath");
var gulp_config_1 = __importDefault(require("./gulp.config"));
var gulp_deploy_1 = require("./gulp.deploy");
var array_1 = require("./utils/array");
var deployDir = (0, gulp_deploy_1.deployConfig)().deployDir;
var originfile = (0, upath_1.join)(process.cwd(), 'public/sitemap.txt');
var sitemapTXT = (0, upath_1.join)(deployDir, 'sitemap.txt');
var sitemaps = (0, fs_extra_1.readFileSync)(originfile, 'utf-8').split(/\r?\n/gm);
var crawled = new Set();
/**
 * Sitemap Generator
 * @param url url to crawl
 * @param depth crawl deeper n times
 * @returns
 */
function generateSitemap(url, depth) {
    var _this = this;
    if (depth === void 0) { depth = 0; }
    return new bluebird_1.default(function (resolve) {
        var promises = [];
        if (typeof url === 'string') {
            crawled.add(url);
            promises.push((0, sitemap_crawler_1.sitemapCrawlerAsync)(url, {
                deep: 2
            }));
        }
        else {
            crawled.add(gulp_config_1.default.url);
            promises.push((0, sitemap_crawler_1.sitemapCrawlerAsync)(gulp_config_1.default.url, {
                deep: 2
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
            // writeFileSync(saveto, JSON.stringify(mapped, null, 2));
            return mapped;
        })
            .then(function (results) { return __awaiter(_this, void 0, void 0, function () {
            var i, ii, url_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sitemaps = (0, array_1.array_unique)(Object.values(results)
                            .flat(1)
                            .concat(sitemaps)
                            .filter(function (x, i, a) {
                            return a.indexOf(x) === i && typeof x == 'string' && x.length > 0;
                        })).sort(function (a, b) {
                            return a === b ? 0 : a < b ? -1 : 1;
                        });
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < depth)) return [3 /*break*/, 6];
                        ii = 0;
                        _a.label = 2;
                    case 2:
                        if (!(ii < sitemaps.length)) return [3 /*break*/, 5];
                        url_1 = sitemaps[ii];
                        if (crawled.has(url_1) || /.(js|ts|css|scss|txt|pdf|png|jpe?g|gif|webp)$/gi.test(url_1))
                            return [3 /*break*/, 4];
                        crawled.add(url_1);
                        console.log('depth crawling', url_1);
                        return [4 /*yield*/, generateSitemap(url_1, depth)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        ii++;
                        return [3 /*break*/, 2];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, sitemaps];
                }
            });
        }); })
            .then(function () { return (0, fs_extra_1.writeFile)(sitemapTXT, sitemaps.join('\n'), function () { return resolve(sitemaps); }); });
    });
}
exports.generateSitemap = generateSitemap;
gulp_1.default.task('sitemap', function () {
    return new bluebird_1.default(function (resolve) {
        generateSitemap(null, 1).then(function () {
            resolve();
        });
    });
});
