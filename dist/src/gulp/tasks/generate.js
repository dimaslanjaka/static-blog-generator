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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var filemanager_1 = require("../../node/filemanager");
var _config_1 = __importStar(require("../../types/_config"));
require("./generate-after");
require("./generate-assets");
require("./generate-feed");
require("./generate-posts");
require("./generate-sitemap");
require("./generate-template");
require("./generate/archives");
require("./import");
require("./minify");
var generated_dir = (0, upath_1.toUnix)((0, upath_1.resolve)((0, upath_1.join)(_config_1.root, _config_1.default.public_dir)));
// .nojekyll
var nojekyll = (0, upath_1.join)(generated_dir, '.nojekyll');
if (!(0, fs_1.existsSync)(nojekyll))
    (0, filemanager_1.write)(nojekyll, '');
gulp_1.default.task('generate', gulp_1.default.series('generate:assets', 'generate:template', 'generate:posts', 'generate:archive', 'generate:sitemap', 'generate:after'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9nZW5lcmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUJBQWdDO0FBQ2hDLDhDQUF3QjtBQUN4QiwrQkFBOEM7QUFDOUMsc0RBQStDO0FBQy9DLDZEQUFtRDtBQUNuRCw0QkFBMEI7QUFDMUIsNkJBQTJCO0FBQzNCLDJCQUF5QjtBQUN6Qiw0QkFBMEI7QUFDMUIsOEJBQTRCO0FBQzVCLCtCQUE2QjtBQUM3QiwrQkFBNkI7QUFDN0Isb0JBQWtCO0FBQ2xCLG9CQUFrQjtBQUVsQixJQUFNLGFBQWEsR0FBRyxJQUFBLGNBQU0sRUFBQyxJQUFBLGVBQU8sRUFBQyxJQUFBLFlBQUksRUFBQyxjQUFJLEVBQUUsaUJBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckUsWUFBWTtBQUNaLElBQU0sUUFBUSxHQUFHLElBQUEsWUFBSSxFQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNsRCxJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMsUUFBUSxDQUFDO0lBQUUsSUFBQSxtQkFBSyxFQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUUvQyxjQUFJLENBQUMsSUFBSSxDQUNQLFVBQVUsRUFDVixjQUFJLENBQUMsTUFBTSxDQUNULGlCQUFpQixFQUNqQixtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2hCLGtCQUFrQixFQUNsQixrQkFBa0IsRUFDbEIsZ0JBQWdCLENBQ2pCLENBQ0YsQ0FBQyJ9