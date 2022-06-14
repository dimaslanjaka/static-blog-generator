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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePost = exports.buildPost = void 0;
var deepmerge_ts_1 = require("deepmerge-ts");
var hexo_post_parser_1 = require("hexo-post-parser");
var upath_1 = require("upath");
var utils_1 = require("../../gulp/utils");
var cache_post_1 = require("../../node/cache-post");
var _config_1 = __importDefault(require("../../types/_config"));
var modifyPost_1 = __importDefault(require("./modifyPost"));
// file:../../../packages/hexo-post-parser/src
var cachePost = new cache_post_1.CachePost();
var __g = (typeof window != 'undefined' ? window : global) /* node */;
/**
 * Parse Markdown Post
 * @see {@link moduleParsePost}
 * @param path file path to read
 * @param content content to parse, skip reading `path` parameter when settled
 * @param options override {@link moduleParsePost} options
 * @returns
 */
var parsePost = function (path, content, options) {
    if (content === void 0) { content = undefined; }
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var default_options, realPath, parse, isPathPost, isTypePost;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    default_options = {
                        shortcodes: {
                            youtube: true,
                            css: true,
                            include: true,
                            link: true,
                            now: true,
                            script: true,
                            text: true,
                            codeblock: true
                        },
                        cache: _config_1.default.generator.cache,
                        config: _config_1.default,
                        formatDate: true,
                        fix: true,
                        sourceFile: path
                    };
                    if (options !== null && typeof options !== 'undefined') {
                        options = (0, deepmerge_ts_1.deepmerge)(default_options, options);
                    }
                    // cache definer setup
                    if (!path && !options.sourceFile)
                        throw new Error("parameter 'path' is undefined, parameter 'options.sourceFile' also undefined. Please insert to 'options.sourceFile' when 'path' not defined (used for type validator and cache key)");
                    realPath = path || options.sourceFile;
                    return [4 /*yield*/, (0, hexo_post_parser_1.parsePost)(content || path, options)];
                case 1:
                    parse = _a.sent();
                    if (!parse) {
                        throw new Error('cannot parse post ' + realPath);
                    }
                    if (typeof path === 'string' && path.length > 0) {
                        // @todo replace no title post
                        if (parse.metadata.title === '.md') {
                            parse.metadata.title = (0, upath_1.basename)(path, '.md');
                        }
                        // @todo add source metadata
                        if (path.includes('src-posts')) {
                            parse.metadata.source = path;
                        }
                        // @todo set flag published
                        if ('published' in parse.metadata === false) {
                            parse.metadata.published = true;
                            if (/\/_drafts?\//.test(path)) {
                                parse.metadata.published = false;
                            }
                        }
                    }
                    if (typeof path !== 'undefined' && path !== null) {
                        parse.fileTree = {
                            source: (0, utils_1.replacePath)((0, upath_1.toUnix)(path.toString()), '/source/_posts/', '/src-posts/'),
                            public: (0, utils_1.replacePath)((0, upath_1.toUnix)(path.toString()), '/src-posts/', '/source/_posts/')
                        };
                    }
                    parse = (0, modifyPost_1.default)(parse);
                    if (!parse) {
                        throw new Error('cannot modify post ' + parse.metadata.title);
                    }
                    isPathPost = realPath.includes(_config_1.default.source_dir + '/_posts');
                    isTypePost = parse.metadata.type === 'post';
                    //const cachedPosts = cachePost.getAll();
                    // @todo indexing post
                    if (isTypePost && isPathPost) {
                        cachePost.set(path, parse);
                    }
                    return [2 /*return*/, parse];
            }
        });
    });
};
exports.parsePost = parsePost;
var hexo_post_parser_2 = require("hexo-post-parser");
Object.defineProperty(exports, "buildPost", { enumerable: true, get: function () { return hexo_post_parser_2.buildPost; } });
exports.default = parsePost;
__g.parsePost = parsePost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VQb3N0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3BhcnNlci9wb3N0L3BhcnNlUG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBeUM7QUFDekMscURBSTBCO0FBQzFCLCtCQUF5QztBQUN6QywwQ0FBK0M7QUFDL0Msb0RBQWtEO0FBQ2xELGdFQUF5QztBQUN6Qyw0REFBc0M7QUFFdEMsOENBQThDO0FBRTlDLElBQU0sU0FBUyxHQUFHLElBQUksc0JBQVMsRUFBRSxDQUFDO0FBQ2xDLElBQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxNQUFNLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQWlCLENBQUM7QUFNL0U7Ozs7Ozs7R0FPRztBQUNILElBQU0sU0FBUyxHQUFHLFVBQ2hCLElBQVksRUFDWixPQUE4QyxFQUM5QyxPQUFpQztJQURqQyx3QkFBQSxFQUFBLG1CQUE4QztJQUM5Qyx3QkFBQSxFQUFBLFlBQWlDOzs7Ozs7b0JBRzNCLGVBQWUsR0FBRzt3QkFDdEIsVUFBVSxFQUFFOzRCQUNWLE9BQU8sRUFBRSxJQUFJOzRCQUNiLEdBQUcsRUFBRSxJQUFJOzRCQUNULE9BQU8sRUFBRSxJQUFJOzRCQUNiLElBQUksRUFBRSxJQUFJOzRCQUNWLEdBQUcsRUFBRSxJQUFJOzRCQUNULE1BQU0sRUFBRSxJQUFJOzRCQUNaLElBQUksRUFBRSxJQUFJOzRCQUNWLFNBQVMsRUFBRSxJQUFJO3lCQUNoQjt3QkFDRCxLQUFLLEVBQUUsaUJBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSzt3QkFDN0IsTUFBTSxFQUFFLGlCQUFNO3dCQUNkLFVBQVUsRUFBRSxJQUFJO3dCQUNoQixHQUFHLEVBQUUsSUFBSTt3QkFDVCxVQUFVLEVBQUUsSUFBSTtxQkFDakIsQ0FBQztvQkFDRixJQUFJ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