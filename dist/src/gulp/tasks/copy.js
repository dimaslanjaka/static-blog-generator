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
exports.copy_posts = exports.copyPosts = void 0;
var gulp_1 = __importDefault(require("gulp"));
var through2_1 = __importDefault(require("through2"));
var color_1 = __importDefault(require("../../node/color"));
var parsePost_1 = require("../../parser/post/parsePost");
var _config_1 = __importStar(require("../../types/_config"));
var utils_1 = require("../utils");
require("./copy/assets");
var logname = color_1.default.cyan('[copy][post]');
/**
 * copy posts from `src-posts` to config.source_dir {@link config.source_dir}
 * @description copy, parsing shortcodes, render html body, etc from src-posts to source_dir
 * @summary copy from src-posts to source/_posts
 * @param cpath custom copy, only copy post with this key
 * @returns
 */
var copyPosts = function (_done, cpath) {
    if (_done === void 0) { _done = null; }
    var exclude = _config_1.default.exclude.map(function (ePattern) { return '!' + ePattern.replace(/^!+/, ''); });
    console.log("".concat(logname, " cwd=").concat(color_1.default.Mahogany(_config_1.post_source_dir), " dest=").concat(color_1.default['Granny Smith Apple'](_config_1.post_public_dir)));
    var run = gulp_1.default
        .src(__spreadArray(['**/*.md', '!**/.git*'], __read(exclude), false), { cwd: _config_1.post_source_dir })
        .pipe(through2_1.default.obj(function (file, _encoding, next) {
        return __awaiter(this, void 0, void 0, function () {
            var path, log, parse, build;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = file.path;
                        if (typeof cpath == 'string' && cpath.length > 2) {
                            // copy specific post path, otherwise drop this item
                            if (!path.includes(cpath))
                                return [2 /*return*/, next()];
                        }
                        log = [logname, String(path)];
                        return [4 /*yield*/, (0, parsePost_1.parsePost)(String(path), String(file.contents))];
                    case 1:
                        parse = _a.sent();
                        if (!parse) {
                            console.log("cannot parse ".concat(String(path)), parse);
                            // drop this item
                            return [2 /*return*/, next()];
                        }
                        build = (0, parsePost_1.buildPost)(parse);
                        if (typeof build == 'string') {
                            //write(tmp(parse.metadata.uuid, 'article.md'), build);
                            log.push(color_1.default.green('success'));
                            file.contents = Buffer.from(build);
                            //if (this) this.push(file);
                            return [2 /*return*/, next(null, file)];
                        }
                        else {
                            console.log(logname, color_1.default.Red('build not string'));
                        }
                        return [2 /*return*/, next()];
                }
            });
        });
    }));
    return (0, utils_1.determineDirname)(run).pipe(gulp_1.default.dest(_config_1.post_public_dir));
};
exports.copyPosts = copyPosts;
/**
 * @see {@link copyPosts}
 */
exports.copy_posts = exports.copyPosts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29weS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2NvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLHNEQUFnQztBQUVoQywyREFBcUM7QUFDckMseURBQW1FO0FBQ25FLDZEQUErRTtBQUMvRSxrQ0FBNEM7QUFDNUMseUJBQXVCO0FBRXZCLElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFM0M7Ozs7OztHQU1HO0FBQ0ksSUFBTSxTQUFTLEdBQUcsVUFBQyxLQUEwQixFQUFFLEtBQWM7SUFBMUMsc0JBQUEsRUFBQSxZQUEwQjtJQUNsRCxJQUFNLE9BQU8sR0FBRyxpQkFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQ2hDLFVBQUMsUUFBUSxJQUFLLE9BQUEsR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFqQyxDQUFpQyxDQUNoRCxDQUFDO0lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FDVCxVQUFHLE9BQU8sa0JBQVEsZUFBSyxDQUFDLFFBQVEsQ0FBQyx5QkFBZSxDQUFDLG1CQUFTLGVBQUssQ0FDN0Qsb0JBQW9CLENBQ3JCLENBQUMseUJBQWUsQ0FBQyxDQUFFLENBQ3JCLENBQUM7SUFDRixJQUFNLEdBQUcsR0FBRyxjQUFJO1NBQ2IsR0FBRyxnQkFBRSxTQUFTLEVBQUUsV0FBVyxVQUFLLE9BQU8sV0FBRyxFQUFFLEdBQUcsRUFBRSx5QkFBZSxFQUFFLENBQUM7U0FDbkUsSUFBSSxDQUNILGtCQUFRLENBQUMsR0FBRyxDQUFDLFVBQWdCLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSTs7Ozs7O3dCQUMxQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzt3QkFDdkIsSUFBSSxPQUFPLEtBQUssSUFBSSxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7NEJBQ2hELG9EQUFvRDs0QkFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2dDQUFFLHNCQUFPLElBQUksRUFBRSxFQUFDO3lCQUMxQzt3QkFDSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3RCLHFCQUFNLElBQUEscUJBQVMsRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFBOzt3QkFBNUQsS0FBSyxHQUFHLFNBQW9EO3dCQUNsRSxJQUFJLENBQUMsS0FBSyxFQUFFOzRCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOzRCQUNuRCxpQkFBaUI7NEJBQ2pCLHNCQUFPLElBQUksRUFBRSxFQUFDO3lCQUNmO3dCQUdLLEtBQUssR0FBRyxJQUFBLHFCQUFTLEVBQU0sS0FBSyxDQUFDLENBQUM7d0JBQ3BDLElBQUksT0FBTyxLQUFLLElBQUksUUFBUSxFQUFFOzRCQUM1Qix1REFBdUQ7NEJBQ3ZELEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ25DLDRCQUE0Qjs0QkFDNUIsc0JBQU8sSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBQzt5QkFDekI7NkJBQU07NEJBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsZUFBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7eUJBQ3JEO3dCQUNELHNCQUFPLElBQUksRUFBRSxFQUFDOzs7O0tBQ2YsQ0FBQyxDQUNILENBQUM7SUFDSixPQUFPLElBQUEsd0JBQWdCLEVBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMseUJBQWUsQ0FBQyxDQUFDLENBQUM7QUFDaEUsQ0FBQyxDQUFDO0FBekNXLFFBQUEsU0FBUyxhQXlDcEI7QUFDRjs7R0FFRztBQUNVLFFBQUEsVUFBVSxHQUFHLGlCQUFTLENBQUMifQ==