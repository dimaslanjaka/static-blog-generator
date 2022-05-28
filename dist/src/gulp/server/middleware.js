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
exports.ServerMiddleWare = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var chalk_1 = __importDefault(require("chalk"));
var compression_1 = __importDefault(require("compression"));
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var deepmerge_ts_1 = require("deepmerge-ts");
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var memoizee_1 = __importDefault(require("memoizee"));
var upath_1 = require("upath");
var url_parser_1 = __importDefault(require("../../curl/url-parser"));
var auto_post_1 = require("../../dummy/auto-post");
var array_utils_1 = require("../../node/array-utils");
var color_1 = __importDefault(require("../../node/color"));
var filemanager_1 = require("../../node/filemanager");
var jsdom_1 = __importDefault(require("../../node/jsdom"));
var string_utils_1 = require("../../node/string-utils");
var parsePost_1 = __importDefault(require("../../parser/post/parsePost"));
var ejs_1 = __importDefault(require("../../renderer/ejs"));
var EJSRenderer_1 = require("../../renderer/ejs/EJSRenderer");
var folder_hashes_1 = require("../../types/folder-hashes");
var _config_1 = __importStar(require("../../types/_config"));
require("../tasks/generate");
var generate_after_1 = __importDefault(require("../tasks/generate-after"));
var archives_1 = require("../tasks/generate/archives");
var categories_1 = require("../tasks/generate/categories");
var tags_1 = require("../tasks/generate/tags");
require("./gen-middleware");
var gulpIndicator = false;
var cwd = (0, memoizee_1.default)(function () { return (0, upath_1.toUnix)(process.cwd()); });
var homepage = new URL(_config_1.default.url);
var preview;
// @todo setup route data tag and category
var routedata = {
    category: [],
    tag: []
};
var labelSrc = [];
var dom = new jsdom_1.default();
function showPreview(str) {
    var previewfile = (0, upath_1.join)(__dirname, 'public/preview.html');
    if (!preview)
        preview = (0, fs_1.existsSync)(previewfile)
            ? (0, fs_1.readFileSync)(previewfile, 'utf-8')
            : 'NO PREVIEW AVAILABLE';
    var doc = dom.parse(String(str));
    doc.body.innerHTML += preview;
    Array.from(doc.querySelectorAll('a')).forEach(function (a) {
        var href = a.getAttribute('href');
        if (typeof href == 'string' &&
            (0, string_utils_1.isMatch)(href, new RegExp('^https?://' + homepage.host))) {
            href = href.replace(new RegExp('^https?://' + homepage.host + '/'), '/');
            return a.setAttribute('href', href);
        }
        a.setAttribute('href', href);
    });
    var body = dom.serialize();
    //body = body.replace(new RegExp(config.url + '/', 'gm'), '/').replace(new RegExp(config.url, 'gm'), '');
    dom.close();
    return body;
}
/** source and src-posts hashes modified indicator */
var hashes = '';
var copyAssets = function () {
    var fn = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fn[_i] = arguments[_i];
    }
    return new bluebird_1.default(function (resolve) {
        if (!gulpIndicator) {
            gulpIndicator = true;
            var tasks_1 = __spreadArray(['generate:assets', 'generate:template'], __read(fn), false).filter(function (s) { return s && (typeof s === 'string' || typeof s === 'function'); });
            bluebird_1.default.all([(0, folder_hashes_1.get_src_posts_hash)(), (0, folder_hashes_1.get_source_hash)()]).spread(function (src_posts, source) {
                // @todo [server] prevent call copy without any modifications
                var chashes = "".concat(src_posts, ":").concat(source);
                if (chashes !== hashes) {
                    hashes = "".concat(src_posts, ":").concat(source);
                    gulp_1.default.series.apply(gulp_1.default, __spreadArray([], __read(tasks_1), false))(function () {
                        gulpIndicator = false;
                        if ((0, fs_1.existsSync)((0, upath_1.join)(cwd(), _config_1.default.public_dir, 'package.json'))) {
                            (0, cross_spawn_1.default)('yarn', ['install', '--check-files', '--production=true'], {
                                cwd: (0, upath_1.join)(cwd(), _config_1.default.public_dir),
                                shell: true,
                                stdio: 'inherit'
                            });
                        }
                        // resolve
                        resolve();
                    });
                }
            });
        }
    });
};
var ServerMiddleWare = [
    function (_, res, next) {
        copyAssets(); // dont await to keep performance
        // custom headers
        res.setHeader('X-Powered-By', 'Static Blog Generator'); // send X-Powered-By
        if (!_config_1.default.server.cache) {
            res.setHeader('Expires', 'on, 01 Jan 1970 00:00:00 GMT');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            res.setHeader('Cache-Control', 'post-check=0, pre-check=0');
            res.setHeader('Pragma', 'no-cache');
        }
        next();
    },
    // category and tag route
    function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var routeFile, pathname, filterPathname, split, labelname, pagenum, i, path, generatedTo, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        routeFile = (0, upath_1.join)(__dirname, 'routes.json');
                        routedata = (0, deepmerge_ts_1.deepmerge)(routedata, JSON.parse((0, fs_1.readFileSync)(routeFile).toString()));
                        labelSrc = (0, array_utils_1.array_unique)(routedata.category.concat(routedata.tag));
                        pathname = req['_parsedUrl'].pathname;
                        filterPathname = pathname.replace(/\/+/, '/').replace(/^\//, '');
                        split = (0, array_utils_1.removeEmpties)(filterPathname.split('/')).map(function (str) {
                            return str.trim();
                        });
                        labelname = split[1];
                        pagenum = split.length > 3 ? parseInt(split[3]) : null;
                        if (!(split.includes(_config_1.default.tag_dir) || split.includes(_config_1.default.category_dir))) return [3 /*break*/, 6];
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < labelSrc.length)) return [3 /*break*/, 6];
                        path = labelSrc[i];
                        if (!pathname.includes(path)) return [3 /*break*/, 5];
                        generatedTo = (0, upath_1.join)(cwd(), _config_1.default.public_dir, decodeURIComponent(filterPathname), 'index.html');
                        //console.log('[generate][label]', replace_pathname, labelname, generatedTo);
                        console.log("".concat(color_1.default['Violet Red']('[generate][label]'), " ").concat(labelname, " ").concat(pagenum || 'null'));
                        if (!(labelname && typeof labelname == 'string')) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, tags_1.generateTags)(labelname, pagenum)];
                    case 2:
                        _a = (_b.sent());
                        if (_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, categories_1.generateCategories)(labelname, pagenum)];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        result = _a;
                        (0, fs_1.writeFileSync)(generatedTo, result);
                        if (result) {
                            return [2 /*return*/, res.end(showPreview(result))];
                        }
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, next()];
                }
            });
        });
    },
    // content route
    function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var url, isHomepage, isArchives, pathname, logname, indexPage, sourceIndex, str, isPage, sourceMD, findSrcPost, _loop_1, index, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = new url_parser_1.default(_config_1.default.url + req.url).result;
                        isHomepage = req.url === '/';
                        isArchives = req.url.startsWith('/archives/');
                        pathname = req['_parsedUrl'].pathname;
                        if (!(isHomepage || isArchives)) return [3 /*break*/, 2];
                        logname = isHomepage
                            ? color_1.default.green('[homepage]')
                            : color_1.default.green('[archive]');
                        indexPage = isArchives ? parseInt(url.filename) : null;
                        sourceIndex = (0, upath_1.join)(cwd(), _config_1.default.public_dir, 'index.html');
                        return [4 /*yield*/, (0, archives_1.generateIndex)(isHomepage ? 'homepage' : indexPage ? indexPage : null)];
                    case 1:
                        str = _a.sent();
                        if (str) {
                            console.log(logname, 'pre-processed', req.url, '->', sourceIndex);
                            return [2 /*return*/, res.end(showPreview(str))];
                        }
                        if ((0, fs_1.existsSync)(sourceIndex)) {
                            console.log(logname, 'processed', req.url, '->', sourceIndex);
                            return [2 /*return*/, res.end(showPreview((0, fs_1.readFileSync)(sourceIndex)))];
                        }
                        return [2 /*return*/, next()];
                    case 2:
                        // @todo skip labels (tag and category)
                        if (labelSrc.includes(pathname))
                            return [2 /*return*/, next()];
                        if ((0, string_utils_1.isMatch)(pathname, new RegExp('^/' + _config_1.default.category_dir + '/')))
                            return [2 /*return*/, next()];
                        if ((0, string_utils_1.isMatch)(pathname, new RegExp('^/' + _config_1.default.tag_dir + '/')))
                            return [2 /*return*/, next()];
                        // skip api, admin
                        if ((0, string_utils_1.isMatch)(pathname, /^\/(api|admin)/))
                            return [2 /*return*/, next()];
                        // skip assets
                        if ((0, string_utils_1.isMatch)(pathname, /.(css|js|png|svg|jpeg|webp|jpg|ico)$/))
                            return [2 /*return*/, next()];
                        isPage = (0, string_utils_1.isMatch)(pathname, /(.html|\/)$/);
                        if (!isPage) return [3 /*break*/, 6];
                        res.setHeader('Content-Type', 'text/html');
                        sourceMD = [
                            (0, upath_1.join)(cwd(), _config_1.default.source_dir, '_posts', decodeURIComponent(pathname)),
                            (0, upath_1.join)(cwd(), _config_1.default.source_dir, decodeURIComponent(pathname))
                        ].map(function (s) {
                            return s.replace(/.html$/, '.md');
                        });
                        // push non-markdown source
                        sourceMD.push((0, upath_1.join)(cwd(), _config_1.default.source_dir, decodeURIComponent(pathname)));
                        findSrcPost = (0, upath_1.join)(cwd(), 'src-posts', decodeURIComponent(pathname));
                        if (findSrcPost.endsWith('/'))
                            findSrcPost += 'index.md';
                        findSrcPost = findSrcPost.replace(/.html$/, '.md');
                        sourceMD.push(findSrcPost);
                        sourceMD = (0, array_utils_1.array_unique)(sourceMD
                            .map(function (path) {
                            if (path.endsWith('/'))
                                return path + 'index.md';
                            return path;
                        })
                            .filter(fs_1.existsSync));
                        if (!(sourceMD.length > 0)) return [3 /*break*/, 6];
                        _loop_1 = function (index) {
                            var file, dest, parsed_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        file = sourceMD[index];
                                        dest = (0, upath_1.join)(_config_1.post_generated_dir, (0, string_utils_1.replaceArr)((0, upath_1.toUnix)(file), [cwd(), 'source/', '_posts/', 'src-posts/'], '')).replace(/.md$/, '.html');
                                        if (!(0, fs_1.existsSync)(file)) return [3 /*break*/, 3];
                                        if (!file.endsWith('.md')) return [3 /*break*/, 2];
                                        return [4 /*yield*/, (0, parsePost_1.default)(file)];
                                    case 1:
                                        parsed_1 = _b.sent();
                                        if (!parsed_1) {
                                            console.log(chalk_1.default.redBright('cannot parse'), file);
                                            return [2 /*return*/, "continue"];
                                        }
                                        return [2 /*return*/, { value: (0, EJSRenderer_1.EJSRenderer)(parsed_1).then(function (rendered) {
                                                    rendered = (0, generate_after_1.default)(rendered);
                                                    (0, filemanager_1.write)(dest, rendered);
                                                    var previewed = showPreview(rendered);
                                                    console.log(chalk_1.default.greenBright("[".concat(parsed_1.metadata.type, "]")), 'pre-processed', pathname, '->', file);
                                                    res.end(previewed);
                                                }) }];
                                    case 2:
                                        if (file.endsWith('.html'))
                                            return [2 /*return*/, { value: res.end(showPreview((0, fs_1.readFileSync)(file))) }];
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        index = 0;
                        _a.label = 3;
                    case 3:
                        if (!(index < sourceMD.length)) return [3 /*break*/, 6];
                        return [5 /*yield**/, _loop_1(index)];
                    case 4:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 5;
                    case 5:
                        index++;
                        return [3 /*break*/, 3];
                    case 6:
                        // show previous generated
                        //if (!pathname) console.log('last processed', pathname);
                        next();
                        return [2 /*return*/];
                }
            });
        });
    },
    // generate dummy posts
    {
        route: '/gen',
        handle: function (_req, res, _next) { return __awaiter(void 0, void 0, void 0, function () {
            var max;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        max = String(_req['_parsedUrl']['query'])
                            .replace(/[^0-9]/g, '')
                            .trim();
                        return [4 /*yield*/, (0, auto_post_1.generateDummyPosts)(parseInt(max) || 5)];
                    case 1:
                        _a.sent();
                        // return res.end(gen);
                        if (!res.headersSent)
                            return [2 /*return*/, res.end('post generating on backend')];
                        return [2 /*return*/];
                }
            });
        }); }
    },
    {
        route: '/api',
        handle: function (req, res, next) {
            // write source/.guid
            if (req.url.includes('generate'))
                (0, filemanager_1.write)((0, upath_1.join)(cwd(), _config_1.default.source_dir, '.guid'), new Date()).then(function () {
                    return console.log('gulp generate start');
                });
            // write public_dir/.guid
            if (req.url.includes('copy'))
                (0, filemanager_1.write)((0, upath_1.join)(cwd(), 'src-posts/.guid'), new Date()).then(function () {
                    return console.log('gulp copy start');
                });
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(new Error('Something went wrong. And we are reporting a custom error message.'), null, 2));
            next();
        }
    },
    {
        route: '/admin',
        handle: function (req, res, next) {
            return ejs_1.default
                .renderFile((0, upath_1.join)(__dirname, 'public/admin.ejs'))
                .then(function (rendered) { return res.end(rendered); })
                .catch(next);
        }
    }
];
exports.ServerMiddleWare = ServerMiddleWare;
if (_config_1.default.server.compress) {
    // push compression to first index
    ServerMiddleWare.unshift.apply((0, compression_1.default)());
}
exports.default = ServerMiddleWare;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3NlcnZlci9taWRkbGV3YXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQyxnREFBMEI7QUFDMUIsNERBQW1DO0FBQ25DLDREQUFnQztBQUNoQyw2Q0FBeUM7QUFDekMseUJBQTZEO0FBQzdELDhDQUEwQztBQUMxQyxzREFBZ0M7QUFDaEMsK0JBQXFDO0FBQ3JDLHFFQUE4QztBQUM5QyxtREFBMkQ7QUFDM0Qsc0RBQXFFO0FBQ3JFLDJEQUFxQztBQUNyQyxzREFBK0M7QUFDL0MsMkRBQW9DO0FBQ3BDLHdEQUE4RDtBQUM5RCwwRUFBb0Q7QUFDcEQsMkRBQTRDO0FBQzVDLDhEQUE2RDtBQUM3RCwyREFBZ0Y7QUFDaEYsNkRBQWlFO0FBQ2pFLDZCQUEyQjtBQUMzQiwyRUFBa0Q7QUFDbEQsdURBQTJEO0FBQzNELDJEQUFrRTtBQUNsRSwrQ0FBc0Q7QUFDdEQsNEJBQTBCO0FBRTFCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztBQUMxQixJQUFNLEdBQUcsR0FBRyxJQUFBLGtCQUFRLEVBQUMsY0FBTSxPQUFBLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7QUFDbEQsSUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQyxJQUFJLE9BQWUsQ0FBQztBQUNwQiwwQ0FBMEM7QUFDMUMsSUFBSSxTQUFTLEdBQUc7SUFDZCxRQUFRLEVBQUUsRUFBYztJQUN4QixHQUFHLEVBQUUsRUFBYztDQUNwQixDQUFDO0FBQ0YsSUFBSSxRQUFRLEdBQWEsRUFBRSxD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