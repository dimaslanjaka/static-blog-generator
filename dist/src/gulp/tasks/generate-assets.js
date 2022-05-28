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
var renderAssets = function () { return __awaiter(void 0, void 0, void 0, function () {
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
gulp_1.default.task('generate:assets', renderAssets);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtYXNzZXRzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZ2VuZXJhdGUtYXNzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUJBQW1FO0FBQ25FLDhDQUF3QjtBQUN4QiwrQkFBc0M7QUFDdEMsMkRBQXFDO0FBQ3JDLHNEQUFpRDtBQUNqRCx3REFBcUQ7QUFDckQsNkRBQXdEO0FBQ3hELElBQU0sY0FBYyxHQUFHLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3hELElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUV4RDs7R0FFRztBQUNILElBQU0sWUFBWSxHQUFHOzs7OztnQkFDYixTQUFTLEdBQUcsSUFBQSxZQUFJLEVBQUMsY0FBSSxFQUFFLGlCQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzFDLFVBQVUsR0FBRyxJQUFBLFlBQUksRUFBQyxjQUFJLEVBQUUsaUJBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3BELE9BQU8sR0FBRyxpQkFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxRQUFRLElBQUssT0FBQSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO2dCQUN4RSxNQUFNLGdDQUFJLFNBQVMsRUFBRSxVQUFVLFVBQUssT0FBTyxrQkFBSyxjQUFjLFNBQUMsQ0FBQztnQkFDekQscUJBQU0sSUFBQSxxQkFBTyxFQUFDLFFBQVEsRUFBRTt3QkFDbkMsR0FBRyxFQUFFLFNBQVM7d0JBQ2QsTUFBTSxFQUFFLE1BQU07d0JBQ2QsR0FBRyxFQUFFLElBQUk7d0JBQ1QsSUFBSSxFQUFFLElBQUk7cUJBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7d0JBQ1IsSUFBSSxpQkFBTSxDQUFDLE9BQU8sRUFBRTs0QkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt5QkFDckI7d0JBQ0QsT0FBTyxDQUFDLENBQUM7b0JBQ1gsQ0FBQyxDQUFDLEVBQUE7O2dCQVhJLElBQUksR0FBRyxTQVdYO2dCQUNGLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDOUIsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDZixHQUFHLEdBQUcsSUFBQSxZQUFJLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUM1QixJQUFJLEdBQUcsSUFBQSxhQUFRLEVBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLElBQUksR0FBRyxJQUFBLFlBQUksRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUQsa0RBQWtEO29CQUNsRCxJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMsSUFBQSxlQUFPLEVBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzVCLElBQUEsY0FBUyxFQUFDLElBQUEsZUFBTyxFQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7b0JBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksSUFBQSxlQUFVLEVBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQzFDLElBQUEsaUJBQVksRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQ1QsT0FBTyxHQUFHLGVBQUssQ0FBQyxXQUFXLENBQUMsV0FBSSxDQUFDLE1BQUcsQ0FBQyxFQUNyQyxJQUFBLHlCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSxhQUFHLEdBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDbkMsSUFBSSxFQUNKLElBQUEseUJBQVUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxJQUFBLGFBQUcsR0FBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUNyQyxDQUFDO3FCQUNIO2lCQUNGOzs7O0tBQ0YsQ0FBQztBQUVGLGNBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUMifQ==