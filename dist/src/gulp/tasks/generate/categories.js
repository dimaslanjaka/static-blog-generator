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
exports.generateCategories = void 0;
var gulp_1 = __importDefault(require("gulp"));
var array_wrapper_1 = require("../../../node/array-wrapper");
var cache_1 = __importDefault(require("../../../node/cache"));
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var modifyPost_1 = __importDefault(require("../../../parser/post/modifyPost"));
var postChunksIterator_1 = __importDefault(require("../../../parser/post/postChunksIterator"));
var postMapper_1 = require("../../../parser/post/postMapper");
var EJSRenderer_1 = require("../../../renderer/ejs/EJSRenderer");
var excerpt_1 = require("../../../renderer/ejs/helper/excerpt");
var thumbnail_1 = require("../../../renderer/ejs/helper/thumbnail");
var _config_1 = __importStar(require("../../../types/_config"));
var cacheCats = new cache_1.default('postCats');
function generateCategories(labelname, pagenum) {
    return __awaiter(this, void 0, void 0, function () {
        var cat_posts, _a, _b, _i, catname, logname, treeChunks, parentChunks, current_page, innerChunks, data, saveTo, pagemeta, merge_data, pagedata, rendered, f;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cat_posts = cacheCats.getAll();
                    _a = [];
                    for (_b in cat_posts)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    catname = _a[_i];
                    if (!Object.prototype.hasOwnProperty.call(cat_posts, catname)) return [3 /*break*/, 6];
                    // specific tag label otherwise skip
                    if (labelname && catname !== labelname)
                        return [3 /*break*/, 6];
                    // skip non array
                    if (!cat_posts[catname] || !Array.isArray(cat_posts[catname]))
                        return [3 /*break*/, 6];
                    logname = color_1.default.Manatee('[generate][tag]') + color_1.default.Fuchsia("[".concat(catname, "]"));
                    treeChunks = (0, postMapper_1.post_chunks)(cat_posts[catname]);
                    parentChunks = treeChunks.chunk;
                    current_page = 0;
                    _c.label = 2;
                case 2:
                    if (!(current_page < parentChunks.length)) return [3 /*break*/, 6];
                    // @todo check specific page number is set, otherwise skip
                    if (typeof pagenum == 'number' && current_page !== pagenum)
                        return [3 /*break*/, 5];
                    innerChunks = (0, array_wrapper_1.array_wrap)(parentChunks[current_page]);
                    data = (0, postChunksIterator_1.default)(innerChunks, {
                        current_page: current_page,
                        base: (0, filemanager_1.join)(_config_1.default.category_dir, catname),
                        parentChunks: parentChunks,
                        treeChunks: treeChunks
                    });
                    saveTo = (0, filemanager_1.join)((0, filemanager_1.cwd)(), _config_1.default.public_dir, data.perm_current, 'index.html');
                    pagemeta = {
                        metadata: {
                            title: 'Category: ' + catname,
                            description: (0, excerpt_1.excerpt)(_config_1.default),
                            date: data.latestUpdated,
                            updated: data.latestUpdated,
                            cover: (0, thumbnail_1.thumbnail)(data.posts[0]),
                            category: [],
                            tags: [],
                            type: 'archive'
                        },
                        body: '',
                        content: '',
                        fileTree: {
                            source: null,
                            public: null
                        }
                    };
                    if (current_page > 0) {
                        pagemeta.metadata.title =
                            'Category: ' + catname + ' Page ' + current_page;
                    }
                    merge_data = Object.assign(pagemeta, data);
                    pagedata = (0, modifyPost_1.default)(merge_data);
                    return [4 /*yield*/, (0, EJSRenderer_1.EJSRenderer)(pagedata)];
                case 3:
                    rendered = _c.sent();
                    return [4 /*yield*/, (0, filemanager_1.write)(saveTo, rendered)];
                case 4:
                    f = _c.sent();
                    console.log(logname, f);
                    if (_config_1.default.verbose) {
                        (0, filemanager_1.write)((0, _config_1.tmp)('generateCategories', data.perm_current + '.log'), (0, postMapper_1.simplifyDump)(pagedata));
                    }
                    if (labelname)
                        return [2 /*return*/, rendered];
                    _c.label = 5;
                case 5:
                    current_page++;
                    return [3 /*break*/, 2];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.generateCategories = generateCategories;
exports.default = generateCategories;
gulp_1.default.task('generate:categories', function () { return generateCategories(); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2dlbmVyYXRlL2NhdGVnb3JpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBd0I7QUFDeEIsNkRBQXlEO0FBQ3pELDhEQUE0QztBQUM1Qyw4REFBd0M7QUFDeEMseURBQTZEO0FBQzdELCtFQUF5RDtBQUV6RCwrRkFBeUU7QUFDekUsOERBQTRFO0FBQzVFLGlFQUFnRTtBQUNoRSxnRUFBK0Q7QUFDL0Qsb0VBQW1FO0FBQ25FLGdFQUFxRDtBQUVyRCxJQUFNLFNBQVMsR0FBRyxJQUFJLGVBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1QyxTQUFzQixrQkFBa0IsQ0FBQyxTQUFrQixFQUFFLE9BQWdCOzs7Ozs7b0JBQ3JFLFNBQVMsR0FBaUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDOzsrQkFDN0MsU0FBUzs7Ozs7Ozt5QkFDekIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBeEQsd0JBQXdEO29CQUMxRCxvQ0FBb0M7b0JBQ3BDLElBQUksU0FBUyxJQUFJLE9BQU8sS0FBSyxTQUFTO3dCQUFFLHdCQUFTO29CQUNqRCxpQkFBaUI7b0JBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFBRSx3QkFBUztvQkFDbEUsT0FBTyxHQUNYLGVBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFdBQUksT0FBTyxNQUFHLENBQUMsQ0FBQztvQkFDN0QsVUFBVSxHQUFHLElBQUEsd0JBQVcs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