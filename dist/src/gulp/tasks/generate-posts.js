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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPost = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var cache_1 = __importDefault(require("../../node/cache"));
var cache_sitemap_1 = __importDefault(require("../../node/cache-sitemap"));
var color_1 = __importDefault(require("../../node/color"));
var filemanager_1 = require("../../node/filemanager");
var string_utils_1 = require("../../node/string-utils");
var modifyPost_1 = require("../../parser/post/modifyPost");
var parsePost_1 = __importStar(require("../../parser/post/parsePost"));
var transformPosts_1 = require("../../parser/transformPosts");
var EJSRenderer_1 = require("../../renderer/ejs/EJSRenderer");
var _config_1 = __importStar(require("../../types/_config"));
/**
 * @see {@link config.source_dir}
 */
var source_dir = (0, upath_1.toUnix)((0, filemanager_1.resolve)((0, filemanager_1.join)(_config_1.root, _config_1.default.source_dir)));
/**
 * @see {@link config.public_dir}
 */
var generated_dir = (0, upath_1.toUnix)((0, filemanager_1.resolve)((0, filemanager_1.join)(_config_1.root, _config_1.default.public_dir)));
if (!(0, fs_1.existsSync)(generated_dir))
    (0, filemanager_1.mkdirSync)(generated_dir);
var logname = chalk_1.default.hex('#fcba03')('[render]');
var renderCache = new cache_1.default('renderArticle');
var sitemap = new cache_sitemap_1.default();
var renderPost = function () {
    var _this = this;
    var log = logname + chalk_1.default.blue('[posts]');
    return new bluebird_1.default(function (resolve) {
        console.log(log, 'generating to', generated_dir);
        var exclude = _config_1.default.exclude.map(function (ePattern) {
            return ePattern.replace(/^!+/, '');
        });
        var ignore = __spreadArray(['_drafts/', '_data/'], __read(exclude), false);
        bluebird_1.default.all((0, filemanager_1.globSrc)('**/*.md', { ignore: ignore, cwd: source_dir }))
            // validate excluded
            .filter(function (file) {
            if (file.match(/_(drafts|data)\//))
                return false;
            return true;
        })
            // transform path and others
            .map(function (file) { return __awaiter(_this, void 0, void 0, function () {
            var result, parsed, modify, merge, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {
                            /**
                             * post type
                             */
                            type: file.includes('_posts/') ? 'post' : 'page',
                            /** Full path (also cache key) */
                            path: (0, filemanager_1.join)(source_dir, file),
                            /** Permalink path */
                            permalink: (0, filemanager_1.removeMultiSlashes)((0, string_utils_1.replaceArr)(file, [(0, filemanager_1.cwd)(), 'source/_posts/', 'src-posts/', '_posts/'], '/')).replace(/.md$/, '.html'),
                            /** Is Cached */
                            cached: false
                        };
                        // set cache indicator, if cache not exist and argument nocache not set
                        result.cached = renderCache.has(result.path) && _config_1.default.generator.cache;
                        return [4 /*yield*/, (0, parsePost_1.default)(result.path)];
                    case 1:
                        parsed = _a.sent();
                        // try non-cache method
                        if (!(0, transformPosts_1.validateParsed)(parsed))
                            parsed = (0, parsePost_1.default)(result.path);
                        if (!(0, transformPosts_1.validateParsed)(parsed)) {
                            console.log(log, color_1.default.redBright('[fail]'), 'cannot parse', result.path);
                            return [2 /*return*/];
                        }
                        modify = (0, modifyPost_1.modifyPost)(parsed);
                        if (result.path.includes('Grid'))
                            (0, filemanager_1.write)((0, _config_1.tmp)('modify.md'), (0, parsePost_1.buildPost)(modify)).then(console.log);
                        merge = Object.assign(result, modify, result.path);
                        if (typeof merge.metadata == 'object' &&
                            typeof merge.metadata.url == 'string') {
                            url = new URL(merge.metadata.url);
                            url.pathname = url.pathname.replace(/\/+/, '/');
                            merge.metadata.url = url.toString();
                        }
                        return [2 /*return*/, merge];
                }
            });
        }); })
            // filter only non-empty object
            .filter(function (parsed) { return typeof parsed == 'object'; })
            .then(function (result) {
            console.log(log, 'markdown sources total', result.length);
            var counter = 0;
            /**
             * Queue for process first item
             * @returns
             */
            var runner = function () {
                counter++;
                if (!result.length)
                    return resolve(result.length);
                // get first item
                var parsed = result[0];
                console.log("".concat(counter, " generate post ").concat(parsed.metadata.title));
                /**
                 * remove first item, skip
                 * @returns
                 */
                var skip = function () {
                    result.shift();
                    if (!result.length)
                        return resolve();
                    return runner();
                };
                /**
                 * Save rendered ejs to `config.public_dir`
                 * @param rendered
                 * @returns
                 */
                var save = function (rendered) {
                    var saveto = (0, filemanager_1.join)(generated_dir, parsed.permalink);
                    //console.log(logname, chalk.greenBright('generated'), saveto);
                    (0, filemanager_1.write)(saveto, rendered);
                    parsed.generated = rendered;
                    parsed.generated_path = saveto;
                    renderCache.set(parsed.path, rendered);
                    //write(tmp(parsed.permalink.replace(/.html$/, '.md')), JSON.stringify(parsed));
                    //console.log(logname + chalk.cyanBright('[remaining]', result.length));
                    sitemap.add(parsed.metadata);
                    return parsed;
                };
                if (parsed.cached) {
                    if (renderCache.isFileChanged(parsed.path)) {
                        console.log(log + chalk_1.default.blueBright('[cache]'), parsed.path, chalk_1.default.redBright('changed'));
                    }
                    else {
                        // if cache hit, skip process
                        return skip();
                    }
                }
                (0, EJSRenderer_1.EJSRenderer)(parsed)
                    .then(save)
                    .then(skip)
                    .catch(function (e) {
                    console.log(logname, chalk_1.default.red('[error]'), parsed.path);
                    console.error(e);
                });
            };
            return runner();
        });
    });
};
exports.renderPost = renderPost;
gulp_1.default.task('generate:posts', exports.renderPost);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtcG9zdHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS1wb3N0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBZ0M7QUFDaEMsZ0RBQTBCO0FBQzFCLHlCQUFnQztBQUNoQyw4Q0FBd0I7QUFDeEIsK0JBQStCO0FBQy9CLDJEQUF5QztBQUN6QywyRUFBK0M7QUFDL0MsMkRBQXFDO0FBQ3JDLHNEQVFnQztBQUNoQyx3REFBcUQ7QUFDckQsMkRBQTBEO0FBQzFELHVFQUFtRTtBQUNuRSw4REFBNkQ7QUFDN0QsOERBQTZEO0FBQzdELDZEQUF3RDtBQUV4RDs7R0FFRztBQUNILElBQU0sVUFBVSxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUEscUJBQU8sRUFBQyxJQUFBLGtCQUFJLEVBQUMsY0FBSSxFQUFFLGlCQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xFOztHQUVHO0FBQ0gsSUFBTSxhQUFhLEdBQUcsSUFBQSxjQUFNLEVBQUMsSUFBQSxxQkFBTyxFQUFDLElBQUEsa0JBQUksRUFBQyxjQUFJLEVBQUUsaUJBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckUsSUFBSSxDQUFDLElBQUEsZUFBVSxFQUFDLGFBQWEsQ0FBQztJQUFFLElBQUEsdUJBQVMsRUFBQyxhQUFhLENBQUMsQ0FBQztBQUN6RCxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWpELElBQU0sV0FBVyxHQUFHLElBQUksZUFBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ25ELElBQU0sT0FBTyxHQUFHLElBQUksdUJBQU8sRUFB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