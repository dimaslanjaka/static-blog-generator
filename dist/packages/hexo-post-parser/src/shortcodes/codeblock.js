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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var color_1 = __importDefault(require("../node/color"));
var jsdom_1 = __importDefault(require("../node/jsdom"));
var md5_file_1 = require("../node/md5-file");
var utils_1 = require("../node/utils");
var _config_1 = __importDefault(require("../types/_config"));
var dom = new jsdom_1.default();
var _cache = (0, persistent_cache_1.default)({
    base: (0, upath_1.join)(process.cwd(), 'tmp'),
    name: 'shortcode/codeblock',
    duration: 1000 * 3600 * 24
});
var logname = color_1.default.Shamrock('[codeblock]');
function shortcodeCodeblock(str) {
    return __awaiter(this, void 0, void 0, function () {
        var regex, m, codeblock, openingTag, closingTag, args, content, plain, build, splitArgs, title, url, urlTitle, cacheKey, res, doc, error_1, langs, codeblockBuild, lang;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regex = /(\{% codeblock (.*?) %\}|\{% codeblock %\})((.*?|\n)+?)(\{% endcodeblock %\})/gim;
                    _a.label = 1;
                case 1:
                    if (!((m = regex.exec(str)) !== null)) return [3, 9];
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                    codeblock = m[0];
                    openingTag = m[1];
                    closingTag = m[5];
                    args = m[2];
                    content = m[3];
                    if (!!args) return [3, 2];
                    plain = (0, utils_1.replaceArr)(codeblock, [openingTag, closingTag], [
                        '<pre><code><!-- prettier-ignore-start -->',
                        '<!-- prettier-ignore-end --></code></pre>'
                    ]);
                    str = str.replace(codeblock, plain);
                    return [3, 8];
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
                    if (!(url.length > 0)) return [3, 7];
                    cacheKey = (0, md5_file_1.md5)(url[0]);
                    urlTitle = _cache.getSync(cacheKey);
                    if (!(url[0].match(/^https?:\/\//) && !urlTitle)) return [3, 6];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4, axios_1.default.get(url[0])];
                case 4:
                    res = _a.sent();
                    if (res.status === 200) {
                        doc = dom.parse(res.data);
                        urlTitle = doc.title.trim();
                        dom.close();
                        _cache.putSync(cacheKey, urlTitle);
                        if (_config_1.default.verbose)
                            console.log(logname, 'resolved url title', urlTitle);
                    }
                    else {
                        throw new Error('Response status not !== 200');
                    }
                    return [3, 6];
                case 5:
                    error_1 = _a.sent();
                    if (_config_1.default.verbose) {
                        if (error_1 instanceof Error)
                            console.log(error_1.message);
                        console.log('cannot resolve', url);
                    }
                    return [3, 6];
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
                case 8: return [3, 1];
                case 9: return [2, str];
            }
        });
    });
}
exports.shortcodeCodeblock = shortcodeCodeblock;
