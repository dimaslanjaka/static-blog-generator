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
exports.ServerMiddleWare = exports.middlewareCopyAssets = void 0;
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
var middlewareCopyAssets = function () {
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
exports.middlewareCopyAssets = middlewareCopyAssets;
var ServerMiddleWare = [
    function (_, res, next) {
        (0, exports.middlewareCopyAssets)(); // dont await to keep performance
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
            var routeFile, pathname, filterPathname, split, labelname, pagenum, i, path, generatedTo;
            return __generator(this, function (_a) {
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
                // process tag and category
                if (split.includes(_config_1.default.tag_dir) || split.includes(_config_1.default.category_dir))
                    for (i = 0; i < labelSrc.length; i++) {
                        path = labelSrc[i];
                        //console.log(pathname.includes(path), pathname, path);
                        if (pathname.includes(path)) {
                            generatedTo = (0, upath_1.join)(cwd(), _config_1.default.public_dir, decodeURIComponent(filterPathname), 'index.html');
                            //console.log('[generate][label]', replace_pathname, labelname, generatedTo);
                            console.log("".concat(color_1.default['Violet Red']('[generate][label]'), " ").concat(labelname, " ").concat(pagenum || 'null'));
                            /*if (labelname && typeof labelname == 'string') {
                              const result =
                                (await generateTags(labelname, pagenum)) ||
                                (await generateCategories(labelname, pagenum));
                              writeFileSync(generatedTo, result);
                              if (result) {
                                return res.end(showPreview(result));
                              }
                            }*/
                        }
                    }
                return [2 /*return*/, next()];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3NlcnZlci9taWRkbGV3YXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQyxnREFBMEI7QUFDMUIsNERBQW1DO0FBQ25DLDREQUFnQztBQUNoQyw2Q0FBeUM7QUFDekMseUJBQThDO0FBQzlDLDhDQUEwQztBQUMxQyxzREFBZ0M7QUFDaEMsK0JBQXFDO0FBQ3JDLHFFQUE4QztBQUM5QyxtREFBMkQ7QUFDM0Qsc0RBQXFFO0FBQ3JFLDJEQUFxQztBQUNyQyxzREFBK0M7QUFDL0MsMkRBQW9DO0FBQ3BDLHdEQUE4RDtBQUM5RCwwRUFBb0Q7QUFDcEQsMkRBQTRDO0FBQzVDLDhEQUE2RDtBQUM3RCwyREFBZ0Y7QUFDaEYsNkRBQWlFO0FBQ2pFLDZCQUEyQjtBQUMzQiwyRUFBa0Q7QUFDbEQsdURBQTJEO0FBQzNELDRCQUEwQjtBQUUxQixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDMUIsSUFBTSxHQUFHLEdBQUcsSUFBQSxrQkFBUSxFQUFDLGNBQU0sT0FBQSxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO0FBQ2xELElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsSUFBSSxPQUFlLENBQUM7QUFDcEIsMENBQTBDO0FBQzFDLElBQUksU0FBUyxHQUFHO0lBQ2QsUUFBUSxFQUFFLEVBQWM7SUFDeEIsR0FBRyxFQUFFLEVBQWM7Q0FDcEIsQ0FBQztBQUNGLElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztBQUM1QixJQUFNLEdBQUcsR0FBRyxJ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