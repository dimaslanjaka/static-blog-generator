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
exports.generateIndex = void 0;
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var util_1 = require("util");
var array_wrapper_1 = require("../../../node/array-wrapper");
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var modifyPost_1 = __importDefault(require("../../../parser/post/modifyPost"));
var postMapper_1 = require("../../../parser/post/postMapper");
var EJSRenderer_1 = require("../../../renderer/ejs/EJSRenderer");
var date_1 = require("../../../renderer/ejs/helper/date");
var excerpt_1 = require("../../../renderer/ejs/helper/excerpt");
var _config_1 = __importStar(require("../../../types/_config"));
/**
 * generate index
 * * customized generation by param {@link labelNameOrObj}
 * ```properties
 * "type number"  = generate specific archive page
 * "all"          = generate all homepage and archives
 * "homepage"     = generate only first index/homepage
 * "null"         = all
 * "default"      = all
 * ```
 * @param labelNameOrObj
 * @example
 * generateIndex('homepage'); // only generate homepage
 * generateIndex(4); // only generate page 4
 */
function generateIndex(labelNameOrObj) {
    return __awaiter(this, void 0, void 0, function () {
        var postsChunks, chunks, logname, sitedata, isSpecific, _loop_1, current_page, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    postsChunks = typeof labelNameOrObj == 'object'
                        ? labelNameOrObj
                        : typeof labelNameOrObj == 'function'
                            ? labelNameOrObj()
                            : (0, postMapper_1.post_chunks)();
                    chunks = postsChunks.chunk;
                    logname = color_1.default['Desert Sand']('[generate][index]');
                    if (!chunks.length) {
                        console.log(logname, 'post empty');
                        return [2 /*return*/, null];
                    }
                    sitedata = postsChunks.sitedata;
                    isSpecific = typeof labelNameOrObj == 'number';
                    _loop_1 = function (current_page) {
                        var isHome, saveTo, mapped, latestUpdated, opt, mod, f, rendered;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    isHome = current_page === 0;
                                    if (isSpecific && current_page != labelNameOrObj)
                                        return [2 /*return*/, "continue"];
                                    // break only process homepage
                                    if (labelNameOrObj == 'homepage' && !isHome)
                                        return [2 /*return*/, "break"];
                                    logname = color_1.default['Desert Sand']('[generate][index]');
                                    saveTo = (0, upath_1.join)((0, _config_1.cwd)(), _config_1.default.public_dir, 'index.html');
                                    if (!isHome) {
                                        saveTo = (0, upath_1.join)((0, _config_1.cwd)(), _config_1.default.public_dir, _config_1.default.archive_dir, 'page/' + current_page, 'index.html');
                                        logname = logname + color_1.default.lightpink('[archive]');
                                    }
                                    else {
                                        logname = logname + color_1.default['Granny Smith Apple']('[homepage]');
                                    }
                                    mapped = (0, array_wrapper_1.array_wrap)(chunks[current_page]);
                                    latestUpdated = (0, date_1.getLatestDateArray)(mapped.map(function (post) {
                                        return typeof post.updated == 'string' ? post.updated : post.updated.toString();
                                    }));
                                    opt = {
                                        metadata: {
                                            title: isHome ? 'Homepage' : 'Page ' + current_page,
                                            subtitle: (0, excerpt_1.excerpt)(_config_1.default),
                                            date: latestUpdated,
                                            updated: latestUpdated,
                                            category: [],
                                            tags: [],
                                            type: 'archive',
                                            url: _config_1.default.url
                                        },
                                        /** setup sitedata array as json */
                                        sitedata: JSON.stringify(sitedata),
                                        body: '',
                                        content: '',
                                        fileTree: {
                                            source: saveTo,
                                            public: (0, upath_1.join)((0, _config_1.cwd)(), 'tmp', 'index.html')
                                        },
                                        posts: mapped,
                                        total: chunks.length,
                                        page_now: current_page,
                                        page_prev: (function () {
                                            var prev = current_page - 1;
                                            // returns null if the previous array is not an array type
                                            if (Array.isArray(chunks[prev]))
                                                return prev;
                                        })(),
                                        page_prev_url: (function () {
                                            var prev = '/' + (0, upath_1.join)(_config_1.default.archive_dir, 'page', (current_page - 1).toString());
                                            if (current_page - 1 === 0)
                                                return '/';
                                            return prev;
                                        })(),
                                        page_current_url: (function () {
                                            var current = '/' + (0, upath_1.join)(_config_1.default.archive_dir, 'page', current_page.toString());
                                            if (current_page - 1 === 0)
                                                return '/';
                                            return current;
                                        })(),
                                        page_next_url: '/' + (0, upath_1.join)(_config_1.default.archive_dir, 'page', (current_page + 1).toString()),
                                        page_next: (function () {
                                            var next = current_page + 1;
                                            // returns null if the next array is not an array type
                                            if (Array.isArray(chunks[next]))
                                                return next;
                                        })()
                                    };
                                    mod = (0, modifyPost_1.default)(opt);
                                    // @todo wrap posts array to used in template
                                    mod.posts = (0, array_wrapper_1.array_wrap)(mod.posts);
                                    if (!_config_1.default.verbose) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/generate-archives/rendered.log'), (0, util_1.inspect)(opt.posts))];
                                case 1:
                                    f = _b.sent();
                                    console.log('dump to', f);
                                    _b.label = 2;
                                case 2: return [4 /*yield*/, (0, EJSRenderer_1.EJSRenderer)(mod)];
                                case 3:
                                    rendered = _b.sent();
                                    return [4 /*yield*/, (0, filemanager_1.write)(saveTo, rendered)];
                                case 4:
                                    _b.sent();
                                    console.log(logname, saveTo);
                                    // immediately returns
                                    if (isHome && labelNameOrObj == 'homepage')
                                        return [2 /*return*/, { value: rendered }];
                                    if (isSpecific && labelNameOrObj === current_page)
                                        return [2 /*return*/, { value: rendered }];
                                    return [2 /*return*/];
                            }
                        });
                    };
                    current_page = 0;
                    _a.label = 1;
                case 1:
                    if (!(current_page < chunks.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(current_page)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    if (state_1 === "break")
                        return [3 /*break*/, 4];
                    _a.label = 3;
                case 3:
                    current_page++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.generateIndex = generateIndex;
gulp_1.default.task('generate:categories', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
gulp_1.default.task('generate:tags', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
gulp_1.default.task('generate:index', function () { return generateIndex(); });
gulp_1.default.task('generate:label', gulp_1.default.series('generate:tags', 'generate:categories'));
gulp_1.default.task('generate:labels', gulp_1.default.series('generate:label'));
gulp_1.default.task('generate:archive', gulp_1.default.series('generate:index', 'generate:label'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjaGl2ZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS9hcmNoaXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QjtBQUN4QiwrQkFBNkI7QUFDN0IsNkJBQStCO0FBQy9CLDZEQUF5RDtBQUN6RCw4REFBd0M7QUFDeEMseURBQWtEO0FBQ2xELCtFQUF5RDtBQUN6RCw4REFBMEU7QUFFMUUsaUVBQWdFO0FBQ2hFLDBEQUF1RTtBQUN2RSxnRUFBK0Q7QUFDL0QsZ0VBQXFEO0FBRXJEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsU0FBc0IsYUFBYSxDQUNqQyxjQUlnRDs7Ozs7O29CQUUxQyxXQUFXLEdBQ2YsT0FBTyxjQUFjLElBQUksUUFBUTt3QkFDL0IsQ0FBQyxDQUFDLGNBQWM7d0JBQ2hCLENBQUMsQ0FBQyxPQUFPLGNBQWMsSUFBSSxVQUFVOzRCQUNyQyxDQUFDLENBQUMsY0FBYyxFQUFFOzRCQUNsQixDQUFDLENBQUMsSUFBQSx3QkFBVyxHQUFFLENBQUM7b0JBQ2QsTUFBTSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7b0JBQzdCLE9BQU8sR0FBRyxlQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7d0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO3dCQUNuQyxzQkFBTyxJQUFJLEVBQUM7cUJBQ2I7b0JBRUssUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7b0JBQ2hDLFVBQVUsR0FBRyxPQUFPLGNBQWMsSUFBSSxRQUFRLENBQUM7d0NBQzVDLFlBQVk7Ozs7O29DQUNiLE1BQU0sR0FBRyxZQUFZLEtBQUss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