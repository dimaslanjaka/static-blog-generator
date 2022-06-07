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
exports.generateAssets = void 0;
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var color_1 = __importDefault(require("../../node/color"));
var filemanager_1 = require("../../node/filemanager");
var string_utils_1 = require("../../node/string-utils");
var _config_1 = __importStar(require("../../types/_config"));
var global_exclude = ['**/_drafts/**', '**/_data/**'];
var logname = color_1.default.hex('#fcba03')('[render assets]');
/**
 * copy and process assets from {@link config.source_dir} to {@link config.public_dir}
 */
var generateAssets = function () { return __awaiter(void 0, void 0, void 0, function () {
    var srcFolder, destFolder, exclude, ignore, glob, i, file, src, stat, dest;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                srcFolder = (0, upath_1.join)(_config_1.root, _config_1.default.source_dir);
                destFolder = (0, upath_1.join)(_config_1.root, _config_1.default.public_dir);
                console.log(logname, 'copy', srcFolder, '->', destFolder);
                exclude = _config_1.default.exclude.map(function (ePattern) { return ePattern.replace(/^!+/, ''); });
                ignore = __spreadArray(__spreadArray(['**/*.md', '**/.git*'], __read(exclude), false), __read(global_exclude), false);
                return [4 /*yield*/, (0, filemanager_1.globSrc)('**/*.*', {
                        cwd: srcFolder,
                        ignore: ignore,
                        dot: true,
                        stat: true
                    }).then(function (s) {
                        if (_config_1.default.verbose) {
                            console.log(logname + '[total]', s.length);
                            console.log(ignore);
                        }
                        return s;
                    })];
            case 1:
                glob = _a.sent();
                for (i = 0; i < glob.length; i++) {
                    file = glob[i];
                    src = (0, upath_1.join)(srcFolder, file);
                    stat = (0, fs_1.statSync)(src);
                    dest = (0, upath_1.join)(destFolder, file).replace('_posts/', '/');
                    //console.log([src, existsSync(src)], '->', dest);
                    if (!(0, fs_1.existsSync)((0, upath_1.dirname)(dest)))
                        (0, fs_1.mkdirSync)((0, upath_1.dirname)(dest), { recursive: true });
                    if (!stat.isDirectory() && (0, fs_1.existsSync)(src)) {
                        (0, fs_1.copyFileSync)(src, dest);
                        console.log(logname + color_1.default.greenBright("[".concat(i, "]")), (0, string_utils_1.replaceArr)(src, [(0, _config_1.cwd)(), /^\//], ''), '->', (0, string_utils_1.replaceArr)(dest, [(0, _config_1.cwd)(), /^\//], ''));
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
exports.generateAssets = generateAssets;
gulp_1.default.task('generate:assets', exports.generateAssets);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtYXNzZXRzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZ2VuZXJhdGUtYXNzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlCQUFtRTtBQUNuRSw4Q0FBd0I7QUFDeEIsK0JBQXNDO0FBQ3RDLDJEQUFxQztBQUNyQyxzREFBaUQ7QUFDakQsd0RBQXFEO0FBQ3JELDZEQUF3RDtBQUN4RCxJQUFNLGNBQWMsR0FBRyxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN4RCxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFeEQ7O0dBRUc7QUFDSSxJQUFNLGNBQWMsR0FBRzs7Ozs7Z0JBQ3RCLFNBQVMsR0FBRyxJQUFBLFlBQUksRUFBQyxjQUFJLEVBQUUsaUJBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDMUMsVUFBVSxHQUFHLElBQUEsWUFBSSxFQUFDLGNBQUksRUFBRSxpQkFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNqRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDcEQsT0FBTyxHQUFHLGlCQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFFBQVEsSUFBSyxPQUFBLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUM7Z0JBQ3hFLE1BQU0sZ0NBQUksU0FBUyxFQUFFLFVBQVUsVUFBSyxPQUFPLGtCQUFLLGNBQWMsU0FBQyxDQUFDO2dCQUN6RCxxQkFBTSxJQUFBLHFCQUFPLEVBQUMsUUFBUSxFQUFFO3dCQUNuQyxHQUFHLEVBQUUsU0FBUzt3QkFDZCxNQUFNLEVBQUUsTUFBTTt3QkFDZCxHQUFHLEVBQUUsSUFBSTt3QkFDVCxJQUFJLEVBQUUsSUFBSTtxQkFDWCxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQzt3QkFDUixJQUFJLGlCQUFNLENBQUMsT0FBTyxFQUFFOzRCQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUNyQjt3QkFDRCxPQUFPLENBQUMsQ0FBQztvQkFDWCxDQUFDLENBQUMsRUFBQTs7Z0JBWEksSUFBSSxHQUFHLFNBV1g7Z0JBQ0YsS0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5QixJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNmLEdBQUcsR0FBRyxJQUFBLFlBQUksRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzVCLElBQUksR0FBRyxJQUFBLGFBQVEsRUFBQyxHQUFHLENBQUMsQ0FBQztvQkFDckIsSUFBSSxHQUFHLElBQUEsWUFBSSxFQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUM1RCxrREFBa0Q7b0JBQ2xELElBQUksQ0FBQyxJQUFBLGVBQVUsRUFBQyxJQUFBLGVBQU8sRUFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDNUIsSUFBQSxjQUFTLEVBQUMsSUFBQSxlQUFPLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFBLGVBQVUsRUFBQyxHQUFHLENBQUMsRUFBRTt3QkFDMUMsSUFBQSxpQkFBWSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxPQUFPLEdBQUcsZUFBSyxDQUFDLFdBQVcsQ0FBQyxXQUFJLENBQUMsTUFBRyxDQUFDLEVBQ3JDLElBQUEseUJBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLGFBQUcsR0FBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUNuQyxJQUFJLEVBQ0osSUFBQSx5QkFBVSxFQUFDLElBQUksRUFBRSxDQUFDLElBQUEsYUFBRyxHQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQ3JDLENBQUM7cUJBQ0g7aUJBQ0Y7Ozs7S0FDRixDQUFDO0FBcENXLFFBQUEsY0FBYyxrQkFvQ3pCO0FBRUYsY0FBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxzQkFBYyxDQUFDLENBQUMifQ==