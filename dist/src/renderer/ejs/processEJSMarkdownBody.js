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
exports.processEJSMarkdownBody = void 0;
var upath_1 = require("upath");
var util_1 = require("util");
var _1 = require(".");
var filemanager_1 = require("../../node/filemanager");
var string_utils_1 = require("../../node/string-utils");
var parsePost_1 = __importDefault(require("../../parser/post/parsePost"));
var _config_1 = __importStar(require("../../types/_config"));
var helpers_1 = require("../helpers");
/**
 * Process EJS shortcode in markdown body
 * @param sourcePost
 * @returns
 */
function processEJSMarkdownBody(sourcePost) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, defaultOpt, page_url, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof sourcePost === 'string')) return [3 /*break*/, 2];
                    console.log('parse from str');
                    return [4 /*yield*/, (0, parsePost_1.default)(sourcePost, null, { cache: false })];
                case 1:
                    parsed = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    if (!sourcePost) {
                        throw new Error('cannot process EJS Markdown Body, parameter "sourcePost" is undefined');
                    }
                    else {
                        parsed = sourcePost;
                    }
                    _a.label = 3;
                case 3:
                    if (_config_1.isDev)
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/tests', (0, string_utils_1.cleanWhiteSpace)(parsed.metadata.title, '-') + '-body-plains.md'), parsed.body).then(console.log);
                    defaultOpt = {
                        cache: _config_1.default.generator.cache
                    };
                    page_url = _config_1.default.url.replace(/\/+$/, '') +
                        '/' +
                        parsed.metadata.permalink.replace(/^\/+/, '');
                    data = Object.assign(defaultOpt, {
                        page: Object.assign(parsed.metadata, parsed),
                        // site config
                        config: _config_1.default,
                        // layout theme
                        root: _config_1.theme_dir,
                        // theme config
                        theme: _config_1.theme_config,
                        // permalink
                        url: page_url,
                        // content
                        content: null,
                        body: null,
                        rendererHelpers: helpers_1.rendererHelpers
                    });
                    // render body markdown to ejs compiled
                    if (parsed.body)
                        parsed.body = (0, _1.EJSRenderString)(parsed.body, data);
                    if (parsed.content)
                        parsed.content = (0, _1.EJSRenderString)(parsed.body, data);
                    if (_config_1.isDev) {
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/tests', (0, string_utils_1.cleanWhiteSpace)(data.page.title, '-') + '-parsed.log'), (0, util_1.inspect)(parsed)).then(console.log);
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/tests', (0, string_utils_1.cleanWhiteSpace)(data.page.title, '-') + '-body-rendered.md'), parsed.body).then(console.log);
                    }
                    return [2 /*return*/, parsed.body || parsed.content];
            }
        });
    });
}
exports.processEJSMarkdownBody = processEJSMarkdownBody;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc0VKU01hcmtkb3duQm9keS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yZW5kZXJlci9lanMvcHJvY2Vzc0VKU01hcmtkb3duQm9keS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUE2QjtBQUM3Qiw2QkFBK0I7QUFDL0Isc0JBQW9DO0FBQ3BDLHNEQUErQztBQUMvQyx3REFBMEQ7QUFDMUQsMEVBQWlFO0FBQ2pFLDZEQUE2RTtBQUM3RSxzQ0FBNkM7QUFFN0M7Ozs7R0FJRztBQUNILFNBQXNCLHNCQUFzQixDQUFDLFVBQTRCOzs7Ozs7eUJBRW5FLENBQUEsT0FBTyxVQUFVLEtBQUssUUFBUSxDQUFBLEVBQTlCLHdCQUE4QjtvQkFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUNyQixxQkFBTSxJQUFBLG1CQUFTLEVBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFBOztvQkFBNUQsTUFBTSxHQUFHLFNBQW1ELENBQUM7OztvQkFDeEQsSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDdEIsTUFBTSxJQUFJLEtBQUssQ0FDYix1RUFBdUUsQ0FDeEUsQ0FBQztxQkFDSDt5QkFBTTt3QkFDTCxNQUFNLEdBQUcsVUFBVSxDQUFDO3FCQUNyQjs7O29CQUNELElBQUksZUFBSzt3QkFDUCxJQUFBLG1CQUFLLEVBQ0gsSUFBQSxZQUFJLEVBQ0YsU0FBUyxFQUNULFdBQVcsRUFDWCxJQUFBLDhCQUFlLEVBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsaUJBQWlCLENBQ2hFLEVBQ0QsTUFBTSxDQUFDLElBQUksQ0FDWixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRWhCLFVBQVUsR0FBZ0I7d0JBQzlCLEtBQUssRUFBRSxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLO3FCQUM5QixDQUFDO29CQUNJLFFBQVEsR0FDWixpQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQzt3QkFDOUIsR0FBRzt3QkFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7d0JBQ3JDLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO3dCQUM1QyxjQUFjO3dCQUNkLE1BQU0sRUFBRSxpQkFBTTt3QkFDZCxlQUFlO3dCQUNmLElBQUksRUFBRSxtQkFBUzt3QkFDZixlQUFlO3dCQUNmLEtBQUssRUFBRSxzQkFBWTt3QkFDbkIsWUFBWTt3QkFDWixHQUFHLEVBQUUsUUFBUTt3QkFDYixVQUFVO3dCQUNWLE9BQU8sRUFBRSxJQUFJO3dCQUNiLElBQUksRUFBRSxJQUFJO3dCQUNWLGVBQWUsMkJBQUE7cUJBQ2hCLENBQUMsQ0FBQztvQkFDSCx1Q0FBdUM7b0JBQ3ZDLElBQUksTUFBTSxDQUFDLElBQUk7d0JBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFBLGtCQUFlLEVBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDbEUsSUFBSSxNQUFNLENBQUMsT0FBTzt3QkFBRSxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUEsa0JBQWUsRUFBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUN4RSxJQUFJLGVBQUssRUFBRTt3QkFDVCxJQUFBLG1CQUFLLEVBQ0gsSUFBQSxZQUFJLEVBQ0YsU0FBUyxFQUNULFdBQVcsRUFDWCxJQUFBLDhCQUFlLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUN0RCxFQUNELElBQUEsY0FBTyxFQUFDLE1BQU0sQ0FBQyxDQUNoQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBRXBCLElBQUEsbUJBQUssRUFDSCxJQUFBLFlBQUksRUFDRixTQUFTLEVBQ1QsV0FBVyxFQUNYLElBQUEsOEJBQWUsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxtQkFBbUIsQ0FDNUQsRUFDRCxNQUFNLENBQUMsSUFBSSxDQUNaLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDckI7b0JBQ0Qsc0JBQU8sTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFDOzs7O0NBQ3RDO0FBbkVELHdEQW1FQyJ9