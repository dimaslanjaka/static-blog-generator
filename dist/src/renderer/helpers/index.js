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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rendererHelpers = exports.helpers = exports.layout = void 0;
var fs_1 = require("fs");
var upath_1 = require("upath");
var cache_post_1 = require("../../node/cache-post");
var _config_1 = require("../../types/_config");
var author = __importStar(require("./author"));
var date = __importStar(require("./date"));
var excerpt = __importStar(require("./excerpt"));
var internal_helpers_1 = require("./internal-helpers");
var keywords = __importStar(require("./keywords"));
var tag = __importStar(require("./labels"));
var locale = __importStar(require("./locales"));
var thumbnail = __importStar(require("./thumbnail"));
/**
 * layout.ejs from theme_dir
 * @see {@link theme_dir}
 */
exports.layout = (0, upath_1.join)(_config_1.theme_dir, 'layout/layout.ejs');
exports.helpers = Object.assign({
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
            cwdFile: (0, upath_1.join)((0, _config_1.cwd)(), path),
            themeFile: (0, upath_1.join)(_config_1.theme_dir, path),
            layoutFile: (0, upath_1.join)((0, upath_1.dirname)(exports.layout), path)
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
}, author, date, locale, thumbnail, keywords, excerpt, tag, internal_helpers_1.internal_helpers);
exports.rendererHelpers = exports.helpers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcmVuZGVyZXIvaGVscGVycy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlCQUE4QztBQUM5QywrQkFBc0M7QUFDdEMsb0RBSStCO0FBRS9CLCtDQUFxRDtBQUNyRCwrQ0FBbUM7QUFDbkMsMkNBQStCO0FBQy9CLGlEQUFxQztBQUNyQyx1REFBc0Q7QUFDdEQsbURBQXVDO0FBQ3ZDLDRDQUFnQztBQUNoQyxnREFBb0M7QUFDcEMscURBQXlDO0FBRXpDOzs7R0FHRztBQUNVLFFBQUEsTUFBTSxHQUFHLElBQUEsWUFBSSxFQUFDLG1CQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUU5QyxRQUFBLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUNsQztJQUNFOztPQUVHO0lBQ0gsY0FBYyxFQUFFLDJCQUFjO0lBQzlCOztPQUVHO0lBQ0gsY0FBYyxFQUFFLDJCQUFjO0lBQzlCOztPQUVHO0lBQ0gsV0FBVyxFQUFFLHdCQUFXO0lBQ3hCOztPQUVHO0lBQ0gsaUJBQWlCLEVBQUUsQ0FBQztRQUNsQixJQUFJO1lBQ0YsT0FBTyxJQUFBLHdCQUFXLEdBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNO2dCQUM5QixPQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFBdEMsQ0FBc0MsQ0FDdkMsQ0FBQztTQUNIO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLEVBQUUsQ0FBQztTQUNYO0lBQ0gsQ0FBQyxDQUFDLEVBQUU7SUFDSixHQUFHLEVBQUUsVUFBQyxJQUFZLEVBQUUsVUFBOEI7UUFBOUIsMkJBQUEsRUFBQSxlQUE4QjtRQUNoRCxJQUFNLElBQUksR0FBRztZQUNYLE9BQU8sRUFBRSxJQUFBLFlBQUksRUFBQyxJQUFBLGFBQUcsR0FBRSxFQUFFLElBQUksQ0FBQztZQUMxQixTQUFTLEVBQUUsSUFBQSxZQUFJLEVBQUMsbUJBQVMsRUFBRSxJQUFJLENBQUM7WUFDaEMsVUFBVSxFQUFFLElBQUEsWUFBSSxFQUFDLElBQUEsZUFBTyxFQUFDLGNBQU0sQ0FBQyxFQUFFLElBQUksQ0FBQztTQUN4QyxDQUFDO1FBQ0YsSUFBSSxNQUFjLENBQUM7UUFDbkIsS0FBSyxJQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdEIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFCLElBQUksSUFBQSxlQUFVLEVBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ3ZCLE1BQU0sR0FBRyxJQUFBLGlCQUFZLEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN4QyxNQUFNO2lCQUNQO2FBQ0Y7U0FDRjtRQUNELElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixLQUFLLElBQU0sR0FBRyxJQUFJLFVBQVUsRUFBRTtZQUM1QixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pELElBQU0sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDMUIsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFHLEdBQUcsZ0JBQUssQ0FBQyxPQUFHLENBQUMsQ0FBQzthQUM3QjtTQUNGO1FBQ0QsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLGVBQVEsSUFBSSxtQkFBZ0IsQ0FBQztRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07WUFBRSxPQUFPLGlCQUFVLE1BQU0sYUFBVSxDQUFDO1FBQ3JELE9BQU8saUJBQVUsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBSSxNQUFNLGFBQVUsQ0FBQztJQUN2RCxDQUFDO0NBQ0YsRUFDRCxNQUFNLEVBQ04sSUFBSSxFQUNKLE1BQU0sRUFDTixTQUFTLEVBQ1QsUUFBUSxFQUNSLE9BQU8sRUFDUCxHQUFHLEVBQ0gsbUNBQWdCLENBQ2pCLENBQUM7QUFDVyxRQUFBLGVBQWUsR0FBRyxlQUFPLENBQUMifQ==