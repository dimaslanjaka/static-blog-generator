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
exports.copy_posts = exports.copyPosts = void 0;
var upath_1 = require("upath");
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var parsePost_1 = require("../../../parser/post/parsePost");
var _config_1 = __importStar(require("../../../types/_config"));
require("./assets");
var logname = color_1.default.cyan('[copy][post]');
var paths = typeof _config_1.argv['paths'] === 'string' ? _config_1.argv['paths'].split(',') : null;
/**
 * copy posts from `src-posts` to config.source_dir {@link config.source_dir}
 * @description copy, parsing shortcodes, render html body, etc from src-posts to source_dir
 * @summary copy from src-posts to source/_posts
 * @param customPaths custom copy, only copy post with this key
 * @returns
 */
var copyPosts = function (_done, customPaths, _options) {
    if (_done === void 0) { _done = null; }
    if (customPaths === void 0) { customPaths = paths; }
    if (_options === void 0) { _options = {}; }
    var exclude = _config_1.default.exclude.map(function (ePattern) {
        return ePattern.replace(/^!+/, '');
    });
    console.log("".concat(logname, " cwd=").concat(color_1.default.Mahogany(_config_1.post_source_dir), " dest=").concat(color_1.default['Granny Smith Apple'](_config_1.post_public_dir)));
    var sources = (0, filemanager_1.globSrc)('**/*.md', {
        cwd: _config_1.post_source_dir,
        ignore: exclude
    })
        .filter(function (file) { return file.endsWith('.md'); })
        .map(function (file) { return (0, filemanager_1.crossNormalize)((0, upath_1.join)(_config_1.post_source_dir, file)); });
    if (customPaths) {
        sources = sources.filter(function (path) {
            if (typeof customPaths === 'string')
                return path.includes(customPaths);
            // @fixme filter multiple custom paths
        });
    }
    return sources
        .map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, (0, parsePost_1.parsePost)(file)];
                case 1: return [2 /*return*/, (_a.parse = _b.sent(), _a.file = file, _a)];
            }
        });
    }); })
        .each(function (obj) { return __awaiter(void 0, void 0, void 0, function () {
        var parse, path, source, url, gulpPath, modParse, newUrl, newSource, newGulpPath, buildNewParse, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    parse = obj.parse;
                    path = obj.file;
                    if (!('generator' in _config_1.default)) return [3 /*break*/, 2];
                    if (!('copy' in _config_1.default.generator)) return [3 /*break*/, 2];
                    if (!('posts' in _config_1.default.generator.copy)) return [3 /*break*/, 2];
                    if (!('space' in _config_1.default.generator.copy.posts)) return [3 /*break*/, 2];
                    if (!!_config_1.default.generator.copy.posts.space) return [3 /*break*/, 2];
                    source = parse.metadata.source;
                    url = parse.metadata.url;
                    gulpPath = String(path);
                    if (!/\s/.test(source)) return [3 /*break*/, 2];
                    modParse = Object.assign({}, parse);
                    newUrl = _config_1.default.url +
                        url.replace(_config_1.default.url, '').replace(/\s|%20/g, '-');
                    newSource = source.replace(/\s/g, '-');
                    newGulpPath = gulpPath.replace(/\s/g, '-');
                    if (_config_1.isDev) {
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/posts-fix-hypens', parse.metadata.title + '.log'), [
                            { url: url, newUrl: newUrl },
                            { source: source, newSource: newSource },
                            { gulpPath: gulpPath, newGulpPath: newGulpPath }
                        ]);
                    }
                    modParse.metadata.url = newUrl;
                    modParse.metadata.source = newSource;
                    buildNewParse = (0, parsePost_1.buildPost)(modParse);
                    // write new redirected post
                    (0, filemanager_1.write)((0, upath_1.join)(_config_1.post_public_dir, newUrl.replace(_config_1.default.url, '').replace(/.html$/, '.md')), buildNewParse);
                    if (_config_1.isDev) {
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/posts-fix-hypens', parse.metadata.title + '-redirected.json'), modParse);
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/posts-fix-hypens', parse.metadata.title + '-redirected.md'), buildNewParse);
                    }
                    // apply redirect
                    parse.metadata.redirect_to = newUrl;
                    obj.parse = parse;
                    if (!_config_1.isDev) return [3 /*break*/, 2];
                    _a = filemanager_1.write;
                    _b = [(0, upath_1.join)(__dirname, 'tmp/posts-fix-hypens', parse.metadata.title + '.json')];
                    return [4 /*yield*/, (0, parsePost_1.parsePost)(null, (0, parsePost_1.buildPost)(parse), {
                            sourceFile: String(path),
                            cache: false
                        })];
                case 1:
                    _a.apply(void 0, _b.concat([_c.sent()]));
                    (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/posts-fix-hypens', parse.metadata.title + '.md'), (0, parsePost_1.buildPost)(parse));
                    _c.label = 2;
                case 2: return [2 /*return*/, obj];
            }
        });
    }); })
        .each(function (obj) { return __awaiter(void 0, void 0, void 0, function () {
        var saveTo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    saveTo = (0, upath_1.join)(_config_1.post_public_dir, obj.file.replace(_config_1.post_source_dir, ''));
                    return [4 /*yield*/, (0, filemanager_1.write)(saveTo, (0, parsePost_1.buildPost)(obj.parse))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
};
exports.copyPosts = copyPosts;
/**
 * @see {@link copyPosts}
 */
exports.copy_posts = exports.copyPosts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9jb3B5L3Bvc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsK0JBQTZCO0FBQzdCLDhEQUF3QztBQUN4Qyx5REFBMkU7QUFDM0UsNERBQXNFO0FBQ3RFLGdFQUtnQztBQUNoQyxvQkFBa0I7QUFFbEIsSUFBTSxPQUFPLEdBQUcsZUFBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMzQyxJQUFNLEtBQUssR0FDVCxPQUFPLGNBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV0RTs7Ozs7O0dBTUc7QUFDSSxJQUFNLFNBQVMsR0FBRyxVQUN2QixLQUEwQixFQUMxQixXQUFzQyxFQUN0QyxRQUF1RDtJQUZ2RCxzQkFBQSxFQUFBLFlBQTBCO0lBQzFCLDRCQUFBLEVBQUEsbUJBQXNDO0lBQ3RDLHlCQUFBLEVBQUEsYUFBdUQ7SUFFdkQsSUFBTSxPQUFPLEdBQUcsaUJBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsUUFBZ0I7UUFDbEQsT0FBQSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7SUFBM0IsQ0FBMkIsQ0FDNUIsQ0FBQztJQUNGLE9BQU8sQ0FBQyxHQUFHLENBQ1QsVUFBRyxPQUFPLGtCQUFRLGVBQUssQ0FBQyxRQUFRLENBQUMseUJBQWUsQ0FBQyxtQkFBUyxlQUFLLENBQzdELG9CQUFvQixDQUNyQixDQUFDLHlCQUFlLENBQUMsQ0FBRSxDQUNyQixDQUFDO0lBQ0YsSUFBSSxPQUFPLEdBQUcsSUFBQSxxQkFB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