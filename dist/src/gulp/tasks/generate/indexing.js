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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var cache_1 = require("../../../node/cache");
var cache_post_1 = require("../../../node/cache-post");
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var scheduler_1 = __importDefault(require("../../../node/scheduler"));
var string_utils_1 = require("../../../node/string-utils");
var parsePost_1 = __importDefault(require("../../../parser/post/parsePost"));
var _config_1 = require("../../../types/_config");
scheduler_1.default.add('indexing-categories', function () {
    var cache = (0, cache_1.pcache)('categories');
    indexingOf(cache);
});
scheduler_1.default.add('indexing-tags', function () {
    var cache = (0, cache_1.pcache)('tags');
    indexingOf(cache);
});
scheduler_1.default.add('indexing-posts', function () { return __awaiter(void 0, void 0, void 0, function () {
    var logname, _a, _b, filePath, e_1_1;
    var e_1, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                logname = color_1.default.Fuchsia('[indexing]');
                if (!(0, fs_1.existsSync)(_config_1.post_public_dir))
                    return [2 /*return*/];
                if (_config_1.verbose)
                    console.log(logname, 'indexing folder', _config_1.post_public_dir);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 6, 7, 8]);
                _a = __values((0, filemanager_1.readdirSync)(_config_1.post_public_dir)), _b = _a.next();
                _d.label = 2;
            case 2:
                if (!!_b.done) return [3 /*break*/, 5];
                filePath = _b.value;
                if (!filePath.endsWith('.md'))
                    return [3 /*break*/, 4];
                if (_config_1.verbose) {
                    console.log(logname, 'parsing', (0, string_utils_1.replaceArr)(filePath, [(0, _config_1.cwd)(), /^\//], ''));
                }
                return [4 /*yield*/, (0, parsePost_1.default)(filePath)];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                _b = _a.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_1_1 = _d.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); });
function indexingOf(cache) {
    // iterate posts to get tags
    var posts = new cache_post_1.CachePost();
    var postTags = {};
    var allPosts = posts.getAll();
    var _loop_1 = function (indexPost) {
        var post = allPosts[indexPost];
        if (post.metadata.tags && !post.metadata.redirect) {
            if (!Array.isArray(post.metadata.tags)) {
                post.metadata.tags = [post.metadata.tags];
            }
            for (var indexTag = 0; indexTag < post.metadata.tags.length; indexTag++) {
                var tagName = post.metadata.tags[indexTag];
                if (!postTags[tagName])
                    postTags[tagName] = [];
                if (!postTags[tagName].find(function (_a) {
                    var metadata = _a.metadata;
                    return metadata.title === post.metadata.title;
                })) {
                    postTags[tagName].push(post);
                }
                if (postTags[tagName].length > 0) {
                    cache.putSync(tagName, postTags[tagName]);
                }
            }
        }
    };
    for (var indexPost = 0; indexPost < allPosts.length; indexPost++) {
        _loop_1(indexPost);
    }
}
function indexing() {
    return 'indexing should be run before process exited';
}
exports.default = indexing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhpbmcuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS9pbmRleGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUJBQWdDO0FBQ2hDLDZDQUE2QztBQUM3Qyx1REFBcUQ7QUFDckQsOERBQXdDO0FBQ3hDLHlEQUF3RDtBQUN4RCxzRUFBZ0Q7QUFDaEQsMkRBQXdEO0FBQ3hELDZFQUFvRTtBQUNwRSxrREFBdUU7QUFDdkUsbUJBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUU7SUFDbkMsSUFBTSxLQUFLLEdBQUcsSUFBQSxjQUFNLEVBQUMsWUFBWSxDQUFDLENBQUM7SUFDbkMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBRUgsbUJBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFO0lBQzdCLElBQU0sS0FBSyxHQUFHLElBQUEsY0FBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQixDQUFDLENBQUMsQ0FBQztBQUVILG1CQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFOzs7Ozs7Z0JBQ3hCLE9BQU8sR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMseUJBQWUsQ0FBQztvQkFBRSxzQkFBTztnQkFDekMsSUFBSSxpQkFBTztvQkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSx5QkFBZSxDQUFDLENBQUM7Ozs7Z0JBQy9DLEtBQUEsU0FBQSxJQUFBLHlCQUFXLEVBQUMseUJBQWUsQ0FBQyxDQUFBOzs7O2dCQUF4QyxRQUFRO2dCQUNqQixJQUFJLENBQUMsUUFBUSxD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