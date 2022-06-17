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
exports.copy_assets = exports.copyAssets = void 0;
var fs_1 = require("fs");
var upath_1 = require("upath");
var cache_post_1 = require("../../../node/cache-post");
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var string_utils_1 = require("../../../node/string-utils");
var parsePost_1 = __importDefault(require("../../../parser/post/parsePost"));
var _config_1 = __importStar(require("../../../types/_config"));
var paths = typeof _config_1.argv['paths'] === 'string' ? _config_1.argv['paths'].split(',') : null;
var logname = color_1.default.magentaBright('[copy][assets]');
/**
 * copy src-post assets to source/_posts
 * @returns
 */
var copyAssets = function (customPaths) {
    if (customPaths === void 0) { customPaths = paths; }
    if (!(0, fs_1.existsSync)(_config_1.post_source_dir)) {
        var msg = _config_1.post_source_dir + ' not found';
        console.log(msg);
        throw new Error(msg);
    }
    console.log("".concat(logname, " cwd=").concat(color_1.default.Mahogany(_config_1.post_source_dir), " dest=").concat(color_1.default['Granny Smith Apple'](_config_1.post_public_dir)));
    var cachePost = new cache_post_1.CachePost();
    var postPaths = cachePost.getAll().map(function (post) {
        if (post.metadata.source)
            return (0, string_utils_1.replaceArr)(post.metadata.source, [_config_1.post_source_dir, (0, _config_1.cwd)(), /^\//], '');
    });
    //console.log(postPaths);
    //const run = gulp.src(['**/*.*', `!**/*.md`], { cwd: post_source_dir });
    //return determineDirname(run).pipe(gulp.dest(post_public_dir));
    return (0, filemanager_1.globSrc)('*/**', {
        cwd: _config_1.post_source_dir,
        ignore: _config_1.default.exclude.concat(['**/*.md', '**/.git*', '**/.git/**'])
    })
        .map(function (path) { return (0, upath_1.join)(_config_1.post_source_dir, path); })
        .filter(function (item) { return __awaiter(void 0, void 0, void 0, function () {
        var isPathValid, parse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isPathValid = 
                    // validate item is not post
                    !postPaths.some(function (route) { return item.includes(route); }) &&
                        (0, fs_1.existsSync)(item) &&
                        (0, fs_1.statSync)(item).isFile();
                    // validate when custom path is set
                    if (typeof customPaths === 'string') {
                        isPathValid = isPathValid && item.includes(customPaths);
                    }
                    else if (Array.isArray(customPaths)) {
                        isPathValid =
                            isPathValid && customPaths.some(function (route) { return item.includes(route); });
                    }
                    if (!isPathValid) return [3 /*break*/, 2];
                    if (!item.endsWith('.md')) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, parsePost_1.default)(item)];
                case 1:
                    parse = _a.sent();
                    if (!parse)
                        return [2 /*return*/, true];
                    _a.label = 2;
                case 2: return [2 /*return*/, isPathValid];
            }
        });
    }); })
        .map(function (path) {
        var src = path;
        var dest = path.replace(_config_1.post_source_dir, _config_1.post_public_dir);
        if (_config_1.default.verbose) {
            console.log(logname, color_1.default.yellow(src).replace((0, _config_1.cwd)(), ''), '->', color_1.default.green(dest).replace((0, _config_1.cwd)(), ''));
        }
        (0, filemanager_1.copy)(src, dest);
        return { src: src, dest: dest };
    });
};
exports.copyAssets = copyAssets;
/**
 * @see {@link copyAssets}
 */
exports.copy_assets = exports.copyAssets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvY29weS9hc3NldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBMEM7QUFDMUMsK0JBQTZCO0FBQzdCLHVEQUFxRDtBQUNyRCw4REFBd0M7QUFDeEMseURBQTBEO0FBQzFELDJEQUF3RDtBQUN4RCw2RUFBdUQ7QUFDdkQsZ0VBS2dDO0FBRWhDLElBQU0sS0FBSyxHQUNULE9BQU8sY0FBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBRXRFLElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUV0RDs7O0dBR0c7QUFDSSxJQUFNLFVBQVUsR0FBRyxVQUFDLFdBQXNDO0lBQXRDLDRCQUFBLEVBQUEsbUJBQXNDO0lBQy9ELElBQUksQ0FBQyxJQUFBLGVBQVUsRUFBQyx5QkFBZSxDQUFDLEVBQUU7UUFDaEMsSUFBTSxHQUFHLEdBQUcseUJBQWUsR0FBRyxZQUFZLENBQUM7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3RCO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FDVCxVQUFHLE9BQU8sa0JBQVEsZUFBSyxDQUFDLFFBQVEsQ0FBQyx5QkFBZSxDQUFDLG1CQUFTLGVBQUssQ0FDN0Qsb0JBQW9CLENBQ3JCLENBQUMseUJBQWUsQ0FBQyxDQUFFLENBQ3JCLENBQUM7SUFDRixJQUFNLFNBQVMsR0FBRyxJQUFJLHNCQUFTLEVB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