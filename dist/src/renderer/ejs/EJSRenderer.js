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
exports.EJSRenderer = void 0;
var upath_1 = require("upath");
var util_1 = require("util");
var filemanager_1 = require("../../node/filemanager");
var toHtml_1 = require("../../parser/toHtml");
var _config_1 = __importStar(require("../../types/_config"));
var helpers_1 = require("../helpers");
var index_1 = __importDefault(require("./index"));
var page_url = new URL(_config_1.default.url);
/**
 * EJS Renderer Engine
 * @param parsed
 * @param override override {@link OverrideEJSOptions} object ejs options {@link ejs.Options}, page data {@link postMap} default empty object
 * @returns rendered promise (Promise\<string\>)
 * renderer injection
 * ```js
 * renderer(parsed, {
 *  // new helper available on ejs layout
 *  newhelper: function () {
 *    return 'new helper';
 *  }
 * })
 * ```
 * ejs
 * ```html
 * <%- newhelper() %>
 * ```
 */
function EJSRenderer(parsed, override) {
    if (override === void 0) { override = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var defaultOpt, pagedata, ejs_data, body, rendered;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof parsed !== 'object') {
                        console.log("'parsed' argument is empty");
                        return [2 /*return*/, null];
                    }
                    else if (!('posts' in parsed)) {
                        // check body only for posts
                        if (typeof parsed.body !== 'string' || parsed.body.length === 0) {
                            console.log("'parsed.body' is empty");
                            return [2 /*return*/, null];
                        }
                    }
                    defaultOpt = {
                        cache: _config_1.default.generator.cache
                    };
                    pagedata = Object.assign(defaultOpt, parsed.metadata, parsed, override);
                    page_url.pathname = parsed['permalink'];
                    ejs_data = Object.assign(parsed, {
                        // page metadata
                        page: pagedata,
                        // site config
                        config: _config_1.default,
                        // layout theme
                        root: _config_1.theme_dir,
                        // theme config
                        theme: _config_1.theme_config,
                        // permalink
                        url: page_url.toString(),
                        // content
                        content: null
                    }, helpers_1.helpers);
                    if (!_config_1.isDev) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp', 'EJSRenderer', 'data.log'), (0, util_1.inspect)(ejs_data))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    body = '';
                    body = index_1.default.render(parsed.body, ejs_data);
                    if (!_config_1.isDev) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp', 'EJSRenderer', 'body-plains.md'), parsed.body)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp', 'EJSRenderer', 'body-rendered.md'), body)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    // render markdown to html
                    if (parsed.body)
                        body = (0, toHtml_1.renderBodyMarkdown)(parsed);
                    // assign body
                    ejs_data.page.content = ejs_data.page.body = body;
                    if (_config_1.isDev) {
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/tests', (0, filemanager_1.sanitizeFileName)(ejs_data.page.title) + '.html'), parsed.body).then(console.log);
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/tests', (0, filemanager_1.sanitizeFileName)(ejs_data.page.title) + '.log'), (0, util_1.inspect)(ejs_data)).then(console.log);
                    }
                    return [4 /*yield*/, index_1.default.renderFile(helpers_1.layout, ejs_data)];
                case 6:
                    rendered = _a.sent();
                    return [2 /*return*/, rendered];
            }
        });
    });
}
exports.EJSRenderer = EJSRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRUpTUmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcmVuZGVyZXIvZWpzL0VKU1JlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQTZCO0FBQzdCLDZCQUErQjtBQUMvQixzREFBaUU7QUFFakUsOENBQXlEO0FBQ3pELDZEQUE2RTtBQUM3RSxzQ0FBNkM7QUFDN0Msa0RBQWlDO0FBRWpDLElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFNckM7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILFNBQXNCLFdBQVcsQ0FDL0IsTUFBd0IsRUFDeEIsUUFBaUM7SUFBakMseUJBQUEsRUFBQSxhQUFpQzs7Ozs7O29CQUVqQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTt3QkFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO3dCQUMxQyxzQkFBTyxJQUFJLEVBQUM7cUJBQ2I7eUJBQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxFQUFFO3dCQUMvQiw0QkFBNEI7d0JBQzVCLElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs0QkFDdEMsc0JBQU8sSUFBSSxFQUFDO3lCQUNiO3FCQUNGO29CQUVLLFVBQVUsR0FBZ0I7d0JBQzlCLEtBQUssRUFBRSxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLO3FCQUM5QixDQUFDO29CQUdJLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFN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