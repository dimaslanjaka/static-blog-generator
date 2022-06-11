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
exports.generateSingleIndex = exports.generateIndex = void 0;
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var util_1 = __importStar(require("util"));
var array_wrapper_1 = require("../../../node/array-wrapper");
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var modifyPost_1 = __importDefault(require("../../../parser/post/modifyPost"));
var EJSRenderer_1 = require("../../../renderer/ejs/EJSRenderer");
var date_1 = require("../../../renderer/ejs/helper/date");
var excerpt_1 = require("../../../renderer/ejs/helper/excerpt");
var _config_1 = __importStar(require("../../../types/_config"));
var homepage_test_1 = __importDefault(require("./homepage.test"));
var logname = color_1.default['Desert Sand']('[generate][index]');
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
    var postsChunks = typeof labelNameOrObj == 'object'
        ? labelNameOrObj
        : typeof labelNameOrObj == 'function'
            ? labelNameOrObj()
            : null;
    if (typeof postsChunks == 'object') {
        if ('chunk' in postsChunks === false) {
            return Object.keys(postsChunks)
                .map(function (labelKey) {
                var opt = generateSingleIndex(postsChunks[labelKey], labelNameOrObj);
                (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/archive', labelKey + '.json'), opt);
                return null;
            })
                .filter(function (gen) { return typeof gen === 'string'; });
        }
        else {
            var opt = generateSingleIndex(postsChunks, labelNameOrObj, {
                title: {
                    index: 'Homepage',
                    pagination: 'Archive Page %d'
                },
                description: (0, excerpt_1.excerpt)(_config_1.default),
                base: _config_1.post_generated_dir,
                url: _config_1.default.url
            });
            (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/archive', "home.json"), opt);
            return null;
        }
    }
}
exports.generateIndex = generateIndex;
function generateSingleIndex(postsChunks, labelNameOrObj, meta) {
    return __awaiter(this, void 0, void 0, function () {
        var chunks_1, sitedata, isSpecific, _loop_1, current_page, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('chunk' in postsChunks)) return [3 /*break*/, 4];
                    chunks_1 = postsChunks['chunk'];
                    if (!Array.isArray(chunks_1)) return [3 /*break*/, 4];
                    if (!chunks_1.length) {
                        console.log(logname, 'post empty');
                        return [2 /*return*/, null];
                    }
                    sitedata = postsChunks.sitedata;
                    isSpecific = typeof labelNameOrObj == 'number';
                    _loop_1 = function (current_page) {
                        var isFirstIndex, saveTo, mapped, latestUpdated, opt, mod, f, rendered;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    isFirstIndex = current_page === 0;
                                    if (isSpecific && current_page != labelNameOrObj)
                                        return [2 /*return*/, "continue"];
                                    // break only process homepage
                                    if (labelNameOrObj == 'homepage' && !isFirstIndex)
                                        return [2 /*return*/, "break"];
                                    logname = color_1.default['Desert Sand']('[generate][index]');
                                    saveTo = (0, upath_1.join)((0, _config_1.cwd)(), _config_1.default.public_dir, 'index.html');
                                    if (!isFirstIndex) {
                                        saveTo = (0, upath_1.join)((0, _config_1.cwd)(), _config_1.default.public_dir, _config_1.default.archive_dir, 'page/' + current_page, 'index.html');
                                        logname = logname + color_1.default.lightpink('[archive]');
                                    }
                                    else {
                                        logname = logname + color_1.default['Granny Smith Apple']('[homepage]');
                                    }
                                    mapped = (0, array_wrapper_1.array_wrap)(chunks_1[current_page]);
                                    latestUpdated = (0, date_1.getLatestDateArray)(mapped.map(function (post) {
                                        return typeof post.updated == 'string'
                                            ? post.updated
                                            : post.updated.toString();
                                    }));
                                    opt = {
                                        metadata: {
                                            title: isFirstIndex
                                                ? meta.title.index
                                                : util_1.default.format(meta.title.pagination, current_page),
                                            description: meta.description,
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
                                            public: (0, upath_1.join)(saveTo, 'tmp/index.html')
                                        },
                                        posts: mapped,
                                        total: chunks_1.length,
                                        page_now: current_page,
                                        page_prev: (function () {
                                            var prev = current_page - 1;
                                            // returns null if the previous array is not an array type
                                            if (Array.isArray(chunks_1[prev]))
                                                return prev;
                                        })(),
                                        page_prev_url: (function () {
                                            var prev = '/' +
                                                (0, upath_1.join)(_config_1.default.archive_dir, 'page', (current_page - 1).toString());
                                            if (current_page - 1 <= 0)
                                                return '/';
                                            return prev;
                                        })(),
                                        page_current_url: (function () {
                                            var current = '/' + (0, upath_1.join)(_config_1.default.archive_dir, 'page', current_page.toString());
                                            if (current_page - 1 === 0)
                                                return '/';
                                            return current;
                                        })(),
                                        page_next_url: '/' +
                                            (0, upath_1.join)(_config_1.default.archive_dir, 'page', (current_page + 1).toString()),
                                        page_next: (function () {
                                            var next = current_page + 1;
                                            // returns null if the next array is not an array type
                                            if (Array.isArray(chunks_1[next]))
                                                return next;
                                        })()
                                    };
                                    // debug
                                    opt.sitedata = '';
                                    opt.posts = [];
                                    (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/archive', current_page + '.json'), opt);
                                    return [2 /*return*/, "continue"];
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
                                    if (isFirstIndex && labelNameOrObj == 'homepage')
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
                    if (!(current_page < chunks_1.length)) return [3 /*break*/, 4];
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
exports.generateSingleIndex = generateSingleIndex;
gulp_1.default.task('test:generate:index', homepage_test_1.default);
gulp_1.default.task('test', gulp_1.default.series('test:generate:index'));
gulp_1.default.task('generate:categories', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
gulp_1.default.task('generate:tags', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
gulp_1.default.task('generate:index', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, generateIndex()];
}); }); });
gulp_1.default.task('generate:label', gulp_1.default.series('generate:tags', 'generate:categories'));
gulp_1.default.task('generate:labels', gulp_1.default.series('generate:label'));
gulp_1.default.task('generate:archive', gulp_1.default.series('generate:index', 'generate:label'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZXBhZ2UuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS9ob21lcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QjtBQUN4QiwrQkFBNkI7QUFDN0IsMkNBQXFDO0FBQ3JDLDZEQUF5RDtBQUN6RCw4REFBd0M7QUFDeEMseURBQWtEO0FBQ2xELCtFQUF5RDtBQUV6RCxpRUFBZ0U7QUFDaEUsMERBQXVFO0FBQ3ZFLGdFQUErRDtBQUMvRCxnRUFBeUU7QUFFekUsa0VBQTJDO0FBRTNDLElBQUksT0FBTyxHQUFHLGVBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRXhEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsU0FBZ0IsYUFBYSxDQUMzQixjQUFtRDtJQUluRCxJQUFNLFdBQVcsR0FDZixPQUFPLGNBQWMsSUFBSSxRQUFRO1FBQy9CLENBQUMsQ0FBQyxjQUFjO1FBQ2hCLENBQUMsQ0FBQyxPQUFPLGNBQWMsSUFBSSxVQUFVO1lBQ3JDLENBQUMsQ0FBQyxjQUFjLEVBQUU7WUFDbEIsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVYLElBQUksT0FBTyxXQUFXLElBQUksUUFBUSxFQUFFO1FBQ2xDLElBQUksT0FBTyxJQUFJLFdBQVcsS0FBSyxLQUFLLEVBQUU7WUFDcEMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztpQkFDNUIsR0FBRyxDQUFDLFVBQUMsUUFBUTtnQkFDWixJQUFNLEdBQUcsR0FBRyxtQkFBbUIsQ0FDN0IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUNyQixjQUFjLENBQ2YsQ0FBQztnQkFFRixJQUFBLG1CQUFLLEVBQUMsSUFBQSxZQUFJLEVBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxRQUFRLEdBQUcs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