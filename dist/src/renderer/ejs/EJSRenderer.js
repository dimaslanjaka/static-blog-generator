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
var fs_1 = require("fs");
var process_1 = require("process");
var upath_1 = require("upath");
var cache_post_1 = require("../../node/cache-post");
var toHtml_1 = require("../../parser/toHtml");
var _config_1 = __importStar(require("../../types/_config"));
var index_1 = __importDefault(require("./index"));
var page_url = new URL(_config_1.default.url);
/**
 * layout.ejs from theme_dir
 * @see {@link theme_dir}
 */
var layout = (0, upath_1.join)(_config_1.theme_dir, 'layout/layout.ejs');
var helpers = {
    /**
     * get latest posts (non-cache)
     */
    getLatestPosts: cache_post_1.getLatestPosts,
    /**
     * get random posts (non-cache)
     */
    getRandomPosts: cache_post_1.getRandomPosts,
    /**
     * get all posts (non-cache)
     */
    getAllPosts: cache_post_1.getAllPosts,
    /**
     * get all posts (cached)
     */
    getAllCachedPosts: (function () {
        try {
            return (0, cache_post_1.getAllPosts)().map(function (parsed) {
                return Object.assign(parsed, parsed.metadata);
            });
        }
        catch (error) {
            return [];
        }
    })(),
    css: function (path, attributes) {
        if (attributes === void 0) { attributes = {}; }
        var find = {
            cwdFile: (0, upath_1.join)((0, process_1.cwd)(), path),
            themeFile: (0, upath_1.join)(_config_1.theme_dir, path),
            layoutFile: (0, upath_1.join)((0, upath_1.dirname)(layout), path)
        };
        var cssStr;
        for (var key in find) {
            if (Object.prototype.hasOwnProperty.call(find, key)) {
                var cssfile = find[key];
                if ((0, fs_1.existsSync)(cssfile)) {
                    cssStr = (0, fs_1.readFileSync)(cssfile, 'utf-8');
                    break;
                }
            }
        }
        var build = [];
        for (var key in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, key)) {
                var v = attributes[key];
                build.push("".concat(key, "=\"").concat(v, "\""));
            }
        }
        if (!cssStr)
            return "<!-- ".concat(path, " not found -->");
        if (!build.length)
            return "<style>".concat(cssStr, "</style>");
        return "<style ".concat(build.join(' '), ">").concat(cssStr, "</style>");
    }
};
/**
 * EJS Renderer Engine
 * @param parsed
 * @param override override {@link Override} object ejs options {@link ejs.Options}, page data {@link postMap} default empty object
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
        var body, defaultOpt, pagedata, ejs_data, rendered;
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
                    body = '';
                    if (parsed.body)
                        body = (0, toHtml_1.renderBodyMarkdown)(parsed);
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
                    }, helpers);
                    // render body html to ejs compiled
                    ejs_data.page.content = index_1.default.render(body, ejs_data);
                    ejs_data.page.body = ejs_data.page.content;
                    return [4 /*yield*/, index_1.default.renderFile(layout, ejs_data)];
                case 1:
                    rendered = _a.sent();
                    return [2 /*return*/, rendered];
            }
        });
    });
}
exports.EJSRenderer = EJSRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRUpTUmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcmVuZGVyZXIvZWpzL0VKU1JlbmRlcmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUJBQThDO0FBQzlDLG1DQUE4QjtBQUM5QiwrQkFBc0M7QUFDdEMsb0RBSStCO0FBRS9CLDhDQUF5RDtBQUV6RCw2REFBc0U7QUFDdEUsa0RBQWlDO0FBRWpDLElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckM7OztHQUdHO0FBQ0gsSUFBTSxNQUFNLEdBQUcsSUFBQSxZQUFJLEVBQUMsbUJBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBRXBELElBQU0sT0FBTyxHQUFHO0lBQ2Q7O09BRUc7SUFDSCxjQUFjLEVBQUUsMkJBQWM7SUFDOUI7O09BRUc7SUFDSCxjQUFjLEVBQUUsMkJBQWM7SUFDOUI7O09BRUc7SUFDSCxXQUFXLEVBQUUsd0JBQVc7SUFDeEI7O09BRUc7SUFDSCxpQkFBaUIsRUFBRSxDQUFDO1FBQ2xCLElBQUk7WUFDRixPQUFPLElBQUEsd0JBQVcsR0FBRSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU07Z0JBQzlCLE9BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUF0QyxDQUFzQyxDQUN2QyxDQUFDO1NBQ0g7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE9BQU8sRUFBRSxDQUFDO1NBQ1g7SUFDSCxDQUFDLENBQUMsRUFBRTtJQUNKLEdBQUcsRUFBRSxVQUFDLElBQVksRUFBRSxVQUE4QjtRQUE5QiwyQkFBQSxFQUFBLGVBQThCO1FBQ2hELElBQU0sSUFBSSxHQUFHO1lBQ1gsT0FBTyxFQUFFLElBQUEsWUFBSSxFQUFD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