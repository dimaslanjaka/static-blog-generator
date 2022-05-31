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
            var routeFile, pathname, filterPathname, split, labelname, pagenum, i, path;
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
                            //console.log(path, pathname);
                            /*const generatedTo = join(
                              cwd(),
                              config.public_dir,
                              decodeURIComponent(filterPathname),
                              'index.html'
                            );*/
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
if ('server' in _config_1.default && 'compress' in _config_1.default.server)
    if (_config_1.default['server']['compress']) {
        // push compression to first index
        ServerMiddleWare.unshift.apply((0, compression_1.default)());
    }
exports.default = ServerMiddleWare;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3NlcnZlci9taWRkbGV3YXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQyxnREFBMEI7QUFDMUIsNERBQW1DO0FBQ25DLDREQUFnQztBQUNoQyw2Q0FBeUM7QUFDekMseUJBQThDO0FBQzlDLDhDQUEwQztBQUMxQyxzREFBZ0M7QUFDaEMsK0JBQXFDO0FBQ3JDLHFFQUE4QztBQUM5QyxtREFBMkQ7QUFDM0Qsc0RBQXFFO0FBQ3JFLDJEQUFxQztBQUNyQyxzREFBK0M7QUFDL0MsMkRBQW9DO0FBQ3BDLHdEQUE4RDtBQUM5RCwwRUFBb0Q7QUFDcEQsMkRBQTRDO0FBQzVDLDhEQUE2RDtBQUM3RCwyREFBZ0Y7QUFDaEYsNkRBQWlFO0FBQ2pFLDZCQUEyQjtBQUMzQiwyRUFBa0Q7QUFDbEQsdURBQTJEO0FBQzNELDRCQUEwQjtBQUUxQixJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDMUIsSUFBTSxHQUFHLEdBQUcsSUFBQSxrQkFBUSxFQUFDLGNBQU0sT0FBQSxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO0FBQ2xELElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsSUFBSSxPQUFlLENBQUM7QUFDcEIsMENBQTBDO0FBQzFDLElBQUksU0FBUyxHQUFHO0lBQ2QsUUFBUSxFQUFFLEVBQWM7SUFDeEIsR0FBRyxFQUFFLEVBQWM7Q0FDcEIsQ0FBQztBQUNGLElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztBQUM1QixJQUFNLEdBQUcsR0FBRyxJ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