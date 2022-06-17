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
function copyPosts(done, customPaths, options) {
    var _this = this;
    if (done === void 0) { done = null; }
    if (customPaths === void 0) { customPaths = paths; }
    if (options === void 0) { options = {}; }
    var exclude = _config_1.default.exclude.map(function (ePattern) {
        return ePattern.replace(/^!+/, '');
    });
    console.log("".concat(logname, " cwd=").concat(color_1.default.Mahogany(_config_1.post_source_dir), " dest=").concat(color_1.default['Granny Smith Apple'](_config_1.post_public_dir)));
    var sources = (0, filemanager_1.globSrc)('**/*.md', {
        cwd: _config_1.post_source_dir,
        ignore: exclude,
        use: 'minimatch'
    })
        .filter(function (file) { return file.endsWith('.md'); })
        .map(function (file) { return (0, filemanager_1.crossNormalize)((0, upath_1.join)(_config_1.post_source_dir, file)); });
    if (customPaths) {
        sources = sources.filter(function (path) {
            if (typeof customPaths === 'string') {
                //console.log(path, path.includes(customPaths));
                return path.includes(customPaths);
            }
            // @fixme filter multiple custom paths
            return false;
        });
        //console.log('using custom path(s)', sources);
    }
    return (sources
        .map(function (file) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, (0, parsePost_1.parsePost)(file, null, options)];
                case 1: return [2 /*return*/, (_a.parse = _b.sent(),
                        _a.file = file,
                        _a.saveTo = null,
                        _a)];
            }
        });
    }); })
        // fix post with space in path
        .each(function (obj) { return __awaiter(_this, void 0, void 0, function () {
        var parse, path, modParse, source, url, gulpPath, newUrl, newSource, newGulpPath, buildNewParse, saveNewTo, objs, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    parse = obj.parse;
                    path = obj.file;
                    if (!/\s/g.test(path)) return [3 /*break*/, 3];
                    if (!('generator' in _config_1.default)) return [3 /*break*/, 3];
                    if (!('copy' in _config_1.default.generator)) return [3 /*break*/, 3];
                    if (!('posts' in _config_1.default.generator.copy)) return [3 /*break*/, 3];
                    if (!('space' in _config_1.default.generator.copy.posts)) return [3 /*break*/, 3];
                    if (!!_config_1.default.generator.copy.posts.space) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, parsePost_1.parsePost)(path, null, Object.assign(options, { cache: false }))];
                case 1:
                    modParse = _c.sent();
                    source = modParse.metadata.source;
                    url = modParse.metadata.url;
                    gulpPath = String(path);
                    newUrl = _config_1.default.url +
                        url.replace(_config_1.default.url, '').replace(/\s|%20/g, '-');
                    newSource = source.replace(/\s/g, '-');
                    newGulpPath = gulpPath.replace(/\s/g, '-');
                    if (_config_1.isDev) {
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/posts-fix-hypens', modParse.metadata.title + '.log'), [
                            { url: url, newUrl: newUrl },
                            { source: source, newSource: newSource },
                            { gulpPath: gulpPath, newGulpPath: newGulpPath }
                        ]);
                    }
                    modParse.metadata.url = newUrl;
                    modParse.metadata.source = newSource;
                    modParse.metadata.permalink =
                        modParse.metadata.permalink.replace(/\s|%20/g, '-');
                    buildNewParse = (0, parsePost_1.buildPost)(modParse);
                    saveNewTo = (0, upath_1.join)(_config_1.post_public_dir, newUrl.replace(_config_1.default.url, '').replace(/.html$/, '.md'));
                    // write new redirected post
                    (0, filemanager_1.write)(saveNewTo, buildNewParse);
                    if (_config_1.isDev) {
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/posts-fix-hypens', modParse.metadata.title + '-redirected.json'), modParse);
                        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/posts-fix-hypens', modParse.metadata.title + '-redirected.md'), buildNewParse);
                    }
                    // apply redirect
                    parse.metadata.redirect_to = newUrl;
                    //console.log(parse.metadata);
                    obj.parse = parse;
                    objs = [
                        {
                            parse: modParse,
                            saveTo: saveNewTo,
                            file: obj.file
                        }
                    ];
                    objs.push(obj);
                    return [2 /*return*/, objs];
                case 2:
                    _a.apply(void 0, _b.concat([_c.sent()]));
                    (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/posts-fix-hypens', parse.metadata.title + '.md'), (0, parsePost_1.buildPost)(parse));
                    _c.label = 3;
                case 3: return [2 /*return*/, obj];
            }
        });
    }); })
        // save
        .each(function (obj) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    obj.saveTo = (0, upath_1.join)(_config_1.post_public_dir, obj.file.replace(_config_1.post_source_dir, ''));
                    return [4 /*yield*/, (0, filemanager_1.write)(obj.saveTo, (0, parsePost_1.buildPost)(obj.parse))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, obj];
            }
        });
    }); })
        .then(function (obj) {
        if (typeof done === 'function')
            done();
        return obj;
    }));
}
exports.copyPosts = copyPosts;
/**
 * @see {@link copyPosts}
 */
exports.copy_posts = copyPosts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9jb3B5L3Bvc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsK0JBQTZCO0FBQzdCLDhEQUF3QztBQUN4Qyx5REFBMkU7QUFDM0UsNERBSXdDO0FBQ3hDLGdFQUtnQztBQUNoQyxvQkFBa0I7QUFFbEIsSUFBTSxPQUFPLEdBQUcsZUFBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMzQyxJQUFNLEtBQUssR0FDVCxPQUFPLGNBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV0RTs7Ozs7O0dBTUc7QUFDSCxTQUFnQixTQUFTLENBQ3ZCLElBQXlCLEVBQ3pCLFdBQXNDLEVBQ3RDLE9BQWlDO0lBSG5DLGlCQStLQztJQTlLQyxxQkFBQSxFQUFBLFdBQXlCO0lBQ3pCLDRCQUFBLEVBQUEsbUJBQXNDO0lBQ3RDLHdCQUFBLEVBQUEsWUFBaUM7SUFFakMsSUFBTSxPQUFPLEdBQUcsaUJBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsUUFBZ0I7UUFDbEQsT0FBQSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7SUFBM0IsQ0FBMkIsQ0FDNUIsQ0FBQztJQUNGLE9BQU8sQ0FBQyxHQUFHLENBQ1QsVUFBRyxPQUFPLGtCQUFRLGVBQUssQ0FBQyxRQUFRLENBQUMseUJBQWUsQ0FBQyxtQkFBUyxlQUFLLENBQzdELG9CQUFvQixDQUNyQixDQUFDLHlCQUFlLENBQUMsQ0FBRSxDQUNyQixDQUFDO0lBRUYsSUFBSSxPQUFPLEdBQUcs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