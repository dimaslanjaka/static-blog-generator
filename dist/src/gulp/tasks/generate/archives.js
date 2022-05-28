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
require("./categories");
require("./tags");
/**
 * generate index
 * * customized generation by param {@link labelname}
 * ```properties
 * "type number"  = generate specific archive page
 * "all"          = generate all homepage and archives
 * "homepage"     = generate only first index/homepage
 * "null"         = all
 * "default"      = all
 * ```
 * @param labelname
 * @example
 * generateIndex('homepage'); // only generate homepage
 * generateIndex(4); // only generate page 4
 */
function generateIndex(labelname) {
    return __awaiter(this, void 0, void 0, function () {
        var postsChunks, chunks, logname, sitedata, isSpecific, _loop_1, current_page, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    postsChunks = (0, postMapper_1.post_chunks)();
                    chunks = postsChunks.chunk;
                    logname = color_1.default['Desert Sand']('[generate][index]');
                    if (!chunks.length) {
                        console.log(logname, 'post empty');
                        return [2 /*return*/, null];
                    }
                    sitedata = postsChunks.sitedata;
                    isSpecific = typeof labelname == 'number';
                    _loop_1 = function (current_page) {
                        var isHome, saveTo, mapped, latestUpdated, opt, mod, f, rendered;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    isHome = current_page === 0;
                                    if (isSpecific && current_page != labelname)
                                        return [2 /*return*/, "continue"];
                                    // break only process homepage
                                    if (labelname == 'homepage' && !isHome)
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
                                    if (isHome && labelname == 'homepage')
                                        return [2 /*return*/, { value: rendered }];
                                    if (isSpecific && labelname === current_page)
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
gulp_1.default.task('generate:index', function () { return generateIndex(); });
gulp_1.default.task('generate:label', gulp_1.default.series('generate:tags', 'generate:categories'));
gulp_1.default.task('generate:labels', gulp_1.default.series('generate:label'));
gulp_1.default.task('generate:archive', gulp_1.default.series('generate:index', 'generate:label'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjaGl2ZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS9hcmNoaXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QjtBQUN4QiwrQkFBNkI7QUFDN0IsNkJBQStCO0FBQy9CLDZEQUF5RDtBQUN6RCw4REFBd0M7QUFDeEMseURBQWtEO0FBQ2xELCtFQUF5RDtBQUN6RCw4REFBMEU7QUFDMUUsaUVBQWdFO0FBQ2hFLDBEQUF1RTtBQUN2RSxnRUFBK0Q7QUFDL0QsZ0VBQXFEO0FBQ3JELHdCQUFzQjtBQUN0QixrQkFBZ0I7QUFFaEI7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFzQixhQUFhLENBQUMsU0FBK0I7Ozs7OztvQkFDM0QsV0FBVyxHQUFHLElBQUEsd0JBQVcsR0FBRSxDQUFDO29CQUM1QixNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQztvQkFDN0IsT0FBTyxHQUFHLGVBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTt3QkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7d0JBQ25DLHNCQUFPLElBQUksRUFBQztxQkFDYjtvQkFFSyxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztvQkFDaEMsVUFBVSxHQUFHLE9BQU8sU0FBUyxJQUFJLFFBQVEsQ0FBQzt3Q0FDdkMsWUFBWTs7Ozs7b0NBQ2IsTUFBTSxHQUFHLFlBQVksS0FBSyxDQUFDLENBQUM7b0NBQ2xDLElBQUksVUFBVSxJQUFJLFlBQVksSUFBSSxTQUFTOzBFQUFXO29DQUN0RCw4QkFBOEI7b0NBQzlCLElBQUksU0FBUyxJQUFJLFVBQVUsSUFB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