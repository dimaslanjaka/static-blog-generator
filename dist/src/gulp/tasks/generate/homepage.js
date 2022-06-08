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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZXBhZ2UuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS9ob21lcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QjtBQUN4QiwrQkFBNkI7QUFDN0IsMkNBQXFDO0FBQ3JDLDZEQUF5RDtBQUN6RCw4REFBd0M7QUFDeEMseURBQWtEO0FBQ2xELCtFQUF5RDtBQUV6RCxpRUFBZ0U7QUFDaEUsMERBQXVFO0FBQ3ZFLGdFQUErRDtBQUMvRCxnRUFBeUU7QUFHekUsSUFBSSxPQUFPLEdBQUcsZUFBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFeEQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixhQUFhLENBQzNCLGNBQW1EO0lBSW5ELElBQU0sV0FBVyxHQUNmLE9BQU8sY0FBYyxJQUFJLFFBQVE7UUFDL0IsQ0FBQyxDQUFDLGNBQWM7UUFDaEIsQ0FBQyxDQUFDLE9BQU8sY0FBYyxJQUFJLFVBQVU7WUFDckMsQ0FBQyxDQUFDLGNBQWMsRUFBRTtZQUNsQixDQUFDLENBQUMsSUFBSSxDQUFDO0lBRVgsSUFBSSxPQUFPLFdBQVcsSUFBSSxRQUFRLEVBQUU7UUFDbEMsSUFBSSxPQUFPLElBQUksV0FBVyxLQUFLLEtBQUssRUFBRTtZQUNwQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2lCQUM1QixHQUFHLENBQUMsVUFBQyxRQUFRO2dCQUNaLElBQU0sR0FBRyxHQUFHLG1CQUFtQixDQUM3QixXQUFXLENBQUMsUUFBUSxDQUFDLEVBQ3JCLGNBQWMsQ0FDZixDQUFDO2dCQUVGLElBQUEsbUJBQUssRUFBQyxJQUFBLFlBQUksRUFBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLFFBQVEsR0FBRyxPQUFPLENBQUMsRUFB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