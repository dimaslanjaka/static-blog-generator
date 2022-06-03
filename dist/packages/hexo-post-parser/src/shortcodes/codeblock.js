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
exports.shortcodeCodeblock = void 0;
var axios_1 = __importDefault(require("axios"));
var persistent_cache_1 = __importDefault(require("persistent-cache"));
var upath_1 = require("upath");
var jsdom_1 = __importDefault(require("../node/jsdom"));
var md5_file_1 = require("../node/md5-file");
var utils_1 = require("../node/utils");
var _config_1 = __importDefault(require("../types/_config"));
var dom = new jsdom_1.default();
var _cache = (0, persistent_cache_1.default)({
    base: (0, upath_1.join)(process.cwd(), 'tmp/persistent-cache'),
    name: 'shortcode/codeblock',
    duration: 1000 * 3600 * 24 // 24 hours
});
function shortcodeCodeblock(str) {
    return __awaiter(this, void 0, void 0, function () {
        var regex, m, codeblock, openingTag, closingTag, args, content, plain, build, splitArgs, title, url, urlTitle, cacheKey, res, doc, error_1, langs, codeblockBuild, lang;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regex = /(\{% codeblock (.*?) %\}|\{% codeblock %\})((.*?|\n)+?)(\{% endcodeblock %\})/gim;
                    _a.label = 1;
                case 1:
                    if (!((m = regex.exec(str)) !== null)) return [3 /*break*/, 9];
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                    codeblock = m[0];
                    openingTag = m[1];
                    closingTag = m[5];
                    args = m[2];
                    content = m[3];
                    if (!!args) return [3 /*break*/, 2];
                    plain = (0, utils_1.replaceArr)(codeblock, [openingTag, closingTag], [
                        '<pre><code><!-- prettier-ignore-start -->',
                        '<!-- prettier-ignore-end --></code></pre>'
                    ]);
                    str = str.replace(codeblock, plain);
                    return [3 /*break*/, 8];
                case 2:
                    build = [];
                    splitArgs = args.split(/\s/).map(function (s) { return s.trim(); });
                    title = typeof splitArgs[0] == 'string' && !splitArgs[0].startsWith('lang:')
                        ? splitArgs[0]
                        : null;
                    if (typeof title == 'string' && title.length > 0) {
                        build.push("<span>".concat(title, "</span>"));
                    }
                    url = splitArgs
                        .filter(function (s) {
                        try {
                            new URL(s);
                            return s.match(/^(https|ftps|ssh|git*)?:\/\//);
                        }
                        catch (error) {
                            return false;
                        }
                    })
                        .filter(function (s) { return typeof s == 'string' && s.length > 0; });
                    urlTitle = void 0;
                    if (!(url.length > 0)) return [3 /*break*/, 7];
                    cacheKey = (0, md5_file_1.md5)(url[0]);
                    // get cache otherwise null
                    urlTitle = _cache.getSync(cacheKey);
                    if (!(url[0].match(/^https?:\/\//) && !urlTitle)) return [3 /*break*/, 6];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, axios_1.default.get(url[0])];
                case 4:
                    res = _a.sent();
                    if (res.status === 200) {
                        doc = dom.parse(res.data);
                        // assign url page title
                        urlTitle = doc.title.trim();
                        // close dom, avoid memory leaks
                        dom.close();
                        // set cache
                        _cache.putSync(cacheKey, urlTitle);
                        if (_config_1.default.verbose)
                            console.log('resolved codeblock url', urlTitle);
                    }
                    else {
                        throw new Error('Response status not !== 200');
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    if (_config_1.default.verbose) {
                        if (error_1 instanceof Error)
                            console.log(error_1.message);
                        console.log('cannot resolve', url);
                    }
                    return [3 /*break*/, 6];
                case 6:
                    if (typeof urlTitle == 'string') {
                        build.push("<a target=\"_blank\" rel=\"noopener external nofollow noreferrer\" href=\"".concat(url[0], "\">").concat(urlTitle, "</a>"));
                    }
                    _a.label = 7;
                case 7:
                    langs = splitArgs
                        .filter(function (s) {
                        if (typeof s == 'string')
                            return s.startsWith('lang:');
                        return false;
                    })
                        .map(function (s) {
                        if (typeof s == 'string')
                            return s.split(':')[1];
                    });
                    codeblockBuild = '';
                    if ((typeof title == 'string' && title.length > 0) ||
                        (typeof urlTitle == 'string' && urlTitle.length > 0)) {
                        codeblockBuild += "<figure class=\"highlight plain\"><figcaption>".concat(build.join(''), "</figcaption>");
                    }
                    if (langs.length > 0) {
                        lang = langs[0];
                        codeblockBuild += "<pre class=\"highlight language-".concat(lang, "\"><code><!-- prettier-ignore-start -->").concat(content, "<!-- prettier-ignore-end --></code></pre></figure>");
                    }
                    else {
                        codeblockBuild += "<pre><code><!-- prettier-ignore-start -->".concat(content, "<!-- prettier-ignore-end --></code></pre></figure>");
                    }
                    str = str.replace(codeblock, codeblockBuild);
                    _a.label = 8;
                case 8: return [3 /*break*/, 1];
                case 9: return [2 /*return*/, str];
            }
        });
    });
}
exports.shortcodeCodeblock = shortcodeCodeblock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWJsb2NrLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsicGFja2FnZXMvaGV4by1wb3N0LXBhcnNlci9zcmMvc2hvcnRjb2Rlcy9jb2RlYmxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBQzFCLHNFQUFxQztBQUNyQywrQkFBNkI7QUFDN0Isd0RBQWlDO0FBQ2pDLDZDQUF1QztBQUN2Qyx1Q0FBMkM7QUFDM0MsNkRBQXNDO0FBRXRDLElBQU0sR0FBRyxHQUFHLElBQUksZUFBSSxFQUFFLENBQUM7QUFDdkIsSUFBTSxNQUFNLEdBQUcsSUFBQSwwQkFBSyxFQUFDO0lBQ25CLElBQUksRUFBRSxJQUFBLFlBQUksRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsc0JBQXNCLENBQUM7SUFDakQsSUFBSSxFQUFFLHFCQUFxQjtJQUMzQixRQUFRLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsV0FBVztDQUN2QyxDQUFDLENBQUM7QUFFSCxTQUFzQixrQkFBa0IsQ0FBQyxHQUFXOzs7Ozs7b0JBQzVDLEtBQUssR0FDVCxrRkFBa0YsQ0FBQzs7O3lCQUc5RSxDQUFBLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUE7b0JBQ25DLG9FQUFvRTtvQkFDcEUsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxTQUFTLEVBQUU7d0JBQy9CLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztxQkFDbkI7b0JBQ0ssU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakIsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxH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