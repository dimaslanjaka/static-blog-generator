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
exports.generatePosts = void 0;
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
function generatePosts() {
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
                            permalink: (0, filemanager_1.removeMultiSlashes)((0, string_utils_1.replaceArr)(file, [(0, _config_1.cwd)(), 'source/_posts/', 'src-posts/', '_posts/'], '/')).replace(/.md$/, '.html'),
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
                    console.log("".concat(counter, " gen post ").concat(parsed.metadata.title, " -> ").concat(saveto));
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
}
exports.generatePosts = generatePosts;
gulp_1.default.task('generate:posts', generatePosts);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtcG9zdHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS1wb3N0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBZ0M7QUFDaEMsZ0RBQTBCO0FBQzFCLHlCQUFnQztBQUNoQyw4Q0FBd0I7QUFDeEIsK0JBQStCO0FBQy9CLDJEQUF5QztBQUN6QywyRUFBK0M7QUFDL0MsMkRBQXFDO0FBQ3JDLHNEQU9nQztBQUNoQyx3REFBcUQ7QUFDckQsMkRBQTBEO0FBQzFELHVFQUFtRTtBQUNuRSw4REFBNkQ7QUFDN0QsOERBQTZEO0FBQzdELDZEQUE2RDtBQUU3RDs7R0FFRztBQUNILElBQU0sVUFBVSxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUEscUJBQU8sRUFBQyxJQUFBLGtCQUFJLEVBQUMsY0FBSSxFQUFFLGlCQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xFOztHQUVHO0FBQ0gsSUFBTSxhQUFhLEdBQUcsSUFBQSxjQUFNLEVBQUMsSUFBQSxxQkFBTyxFQUFDLElBQUEsa0JBQUksRUFBQyxjQUFJLEVBQUUsaUJBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckUsSUFBSSxDQUFDLElBQUEsZUFBVSxFQUFDLGFBQWEsQ0FBQztJQUFFLElBQUEsdUJBQVMsRUFBQyxhQUFhLENBQUMsQ0FBQztBQUN6RCxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWpELElBQU0sV0FBVyxHQUFHLElBQUksZUFBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ25ELElBQU0sT0FBTyxHQUFHLElBQUksdUJBQU8sRUFB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