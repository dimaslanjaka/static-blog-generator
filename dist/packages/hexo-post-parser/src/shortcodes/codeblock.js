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
var lodash_1 = require("lodash");
var upath_1 = require("upath");
var persistent_cache_1 = __importDefault(require("../../packages/persistent-cache"));
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
                    splitArgs = args.split(/\s/).map(lodash_1.trim);
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
                        return s.startsWith('lang:');
                    })
                        .map(function (s) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWJsb2NrLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsicGFja2FnZXMvaGV4by1wb3N0LXBhcnNlci9zcmMvc2hvcnRjb2Rlcy9jb2RlYmxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBQzFCLGlDQUE4QjtBQUM5QiwrQkFBNkI7QUFDN0IscUZBQW9EO0FBQ3BELHdEQUFpQztBQUNqQyw2Q0FBdUM7QUFDdkMsdUNBQTJDO0FBQzNDLDZEQUFzQztBQUV0QyxJQUFNLEdBQUcsR0FBRyxJQUFJLGVBQUksRUFBRSxDQUFDO0FBQ3ZCLElBQU0sTUFBTSxHQUFHLElBQUEsMEJBQUssRUFBQztJQUNuQixJQUFJLEVBQUUsSUFBQSxZQUFJLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHNCQUFzQixDQUFDO0lBQ2pELElBQUksRUFBRSxxQkFBcUI7SUFDM0IsUUFBUSxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLFdBQVc7Q0FDdkMsQ0FBQyxDQUFDO0FBRUgsU0FBc0Isa0JBQWtCLENBQUMsR0FBVzs7Ozs7O29CQUM1QyxLQUFLLEdBQ1Qsa0ZBQWtGLENBQUM7Ozt5QkFHOUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFBO29CQUNuQyxvRUFBb0U7b0JBQ3BFLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsU0FBUyxFQUFFO3dCQUMvQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7cUJBQ25CO29CQUNLLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7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