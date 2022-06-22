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
var google_news_sitemap_1 = __importDefault(require("google-news-sitemap"));
var gulp_1 = __importDefault(require("gulp"));
var moment_1 = __importDefault(require("moment"));
var upath_1 = require("upath");
var array_utils_1 = require("../../node/array-utils");
var cache_sitemap_1 = __importDefault(require("../../node/cache-sitemap"));
var filemanager_1 = require("../../node/filemanager");
var modifyPost_1 = __importDefault(require("../../parser/post/modifyPost"));
var EJSRenderer_1 = require("../../renderer/ejs/EJSRenderer");
var _config_1 = __importStar(require("../../types/_config"));
require("./sitemap");
var logname = chalk_1.default.cyanBright('[generate][sitemap]');
var pages = new cache_sitemap_1.default();
/**
 * Genearate Google News Sitemap
 * * save to `config.public_dir/sitemap-news.xml`
 * @param done
 */
function generateGoogleNewsSitemap(done) {
    return __awaiter(this, void 0, void 0, function () {
        var map, log, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    map = new google_news_sitemap_1.default();
                    log = logname + chalk_1.default.blue('[google-news]');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, bluebird_1.default.all((0, array_utils_1.removeEmpties)(pages.getValues())).map(function (item) {
                            var val = {
                                publication_name: item.author,
                                publication_language: item.lang || 'en',
                                publication_date: item.date.toString(),
                                title: item.title,
                                location: fixURLSitemap(item.url).toString()
                            };
                            return map.add(val);
                        })];
                case 2:
                    i = _a.sent();
                    console.log(log, 'total pages', i.length);
                    (0, filemanager_1.write)((0, upath_1.join)(_config_1.root, _config_1.default.public_dir, 'sitemap-news.xml'), map.toString()).then(function (f) {
                        console.log(log, 'saved', f);
                    });
                    return [3 /*break*/, 4];
                case 3:
                    done();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * fix url
 * * fix multiple slashes
 * @param url url string
 * @returns instance {@link URL}
 */
function fixURLSitemap(url) {
    var parseURL = new URL(url);
    parseURL.pathname = parseURL.pathname
        .replace(/\/+/, '/')
        .replace(/.md$/, '.html');
    return parseURL;
}
/**
 * generate sitemap html
 * * save to `config.public_dir/sitemap.html`
 * @param done
 */
function generateSitemapHtml(done) {
    var log = logname + chalk_1.default.blue('[html]');
    //const exclude = config.sitemap.exclude.map((s) => '!' + s.replace(/^!+/, ''));
    bluebird_1.default.all(pages.getValues())
        .map(function (item) {
        if (!item.url) {
            console.log(log, 'invalid url', item.title || item);
            return;
        }
        return "<a href=\"".concat(fixURLSitemap(item.url).pathname, "\">").concat(item.title, "</a>");
    })
        .then(function (items) {
        if (!items.length) {
            console.log(log, 'sitemap item empty');
            return done();
        }
        var content = items.join('<br/>');
        var url = new URL(_config_1.default.url);
        url.pathname = '/sitemap.html';
        var opt = {
            metadata: {
                title: 'Sitemap',
                subtitle: 'Sitemap ' + new URL(_config_1.default.url).host,
                date: (0, moment_1.default)().format(),
                updated: (0, moment_1.default)().format(),
                category: [],
                tags: [],
                url: url.toString(),
                type: 'page'
            },
            body: content,
            content: content,
            fileTree: {
                source: (0, upath_1.join)((0, _config_1.cwd)(), '.guid'),
                public: (0, upath_1.join)((0, _config_1.cwd)(), '.guid')
            }
        };
        var modify = (0, modifyPost_1.default)(opt);
        if (modify.sitedata)
            delete modify.sitedata;
        //console.log(modify);
        (0, EJSRenderer_1.EJSRenderer)(modify).then(function (rendered) {
            (0, filemanager_1.write)((0, upath_1.join)(_config_1.root, _config_1.default.public_dir, 'sitemap.html'), rendered).then(function (f) {
                console.log(log, 'saved', f);
                done();
            });
        });
    });
}
function generateSitemapText(done) {
    var log = logname + chalk_1.default.blue('[txt]');
    bluebird_1.default.all(pages.getValues())
        .map(function (item) {
        return fixURLSitemap(item.url).toString();
    })
        .then(function (items) {
        (0, filemanager_1.write)((0, upath_1.join)(_config_1.root, _config_1.default.public_dir, 'sitemap.txt'), items.join('\n')).then(function (f) {
            console.log(log, 'saved', f);
            done();
        });
    });
}
// separate sitemap tasks
gulp_1.default.task('generate:sitemap-news', generateGoogleNewsSitemap);
gulp_1.default.task('generate:sitemap-html', generateSitemapHtml);
gulp_1.default.task('generate:sitemap-txt', generateSitemapText);
// combine all sitemap tasks
gulp_1.default.task('generate:sitemap', gulp_1.default.series('generate:sitemap-news', 'generate:sitemap-html', 'generate:sitemap-txt', 'generate:sitemap-xml'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtc2l0ZW1hcC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2dlbmVyYXRlLXNpdGVtYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQyxnREFBMEI7QUFDMUIsNEVBQXVFO0FBQ3ZFLDhDQUF3QjtBQUN4QixrREFBNEI7QUFFNUIsK0JBQTZCO0FBQzdCLHNEQUF1RDtBQUN2RCwyRUFBK0M7QUFDL0Msc0RBQStDO0FBQy9DLDRFQUFzRDtBQUV0RCw4REFBNkQ7QUFDN0QsNkRBQXdEO0FBQ3hELHFCQUFtQjtBQUVuQixJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDeEQsSUFBTSxLQUFLLEdBQUcsSUFBSSx1QkFBTyxFQUFFLENBQUM7QUFFNUI7Ozs7R0FJRztBQUNILFNBQWUseUJBQXlCLENBQUMsSUFBa0I7Ozs7OztvQkFDbkQsR0FBRyxHQUFHLElBQUksNkJBQWlCLEVBQUUsQ0FBQztvQkFDOUIsR0FBRyxHQUFHLE9BQU8sR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7O29CQUd0QyxxQkFBTSxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFBLDJCQUFhLEVBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQ2hFLFVBQUMsSUFBSTs0QkFDSCxJQUFNLEdBQUcsR0FBa0I7Z0NBQ3pCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxNQUFNO2dDQUM3QixvQkFBb0IsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUk7Z0NBQ3ZDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dDQUN0QyxLQUFLLEVBQUUsSUFBSSxDQUFD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