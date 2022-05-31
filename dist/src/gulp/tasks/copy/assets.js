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
exports.copy_assets = exports.copyAssets = void 0;
var fs_1 = require("fs");
var gulp = __importStar(require("gulp"));
var color_1 = __importDefault(require("../../../node/color"));
var _config_1 = require("../../../types/_config");
var utils_1 = require("../../utils");
/**
 * copy src-post assets to source/_posts
 * @returns
 */
var copyAssets = function () {
    if (!(0, fs_1.existsSync)(_config_1.post_source_dir)) {
        var msg = _config_1.post_source_dir + ' not found';
        console.log(msg);
        return Promise.resolve(msg);
    }
    console.log("".concat(color_1.default.magentaBright('[copy][assets]'), " cwd=").concat(color_1.default.Mahogany(_config_1.post_source_dir), " dest=").concat(color_1.default['Granny Smith Apple'](_config_1.post_public_dir)));
    var run = gulp.src(['**/*.*', "!**/*.md"], { cwd: _config_1.post_source_dir });
    return (0, utils_1.determineDirname)(run).pipe(gulp.dest(_config_1.post_public_dir));
};
exports.copyAssets = copyAssets;
/**
 * @see {@link copyAssets}
 */
exports.copy_assets = exports.copyAssets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvY29weS9hc3NldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBZ0M7QUFDaEMseUNBQTZCO0FBQzdCLDhEQUF3QztBQUN4QyxrREFBMEU7QUFDMUUscUNBQStDO0FBRS9DOzs7R0FHRztBQUNJLElBQU0sVUFBVSxHQUFHO0lBQ3hCLElBQUksQ0FBQyxJQUFBLGVBQVUsRUFBQyx5QkFBZSxDQUFDLEVBQUU7UUFDaEMsSUFBTSxHQUFHLEdBQUcseUJBQWUsR0FBRyxZQUFZLENBQUM7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDN0I7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUNULFVBQUcsZUFBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBUSxlQUFLLENBQUMsUUFBUSxDQUM1RCx5QkFBZSxDQUNoQixtQkFBUyxlQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyx5QkFBZSxDQUFDLENBQUUsQ0FDekQsQ0FBQztJQUNGLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUseUJBQWUsRUFBRSxDQUFDLENBQUM7SUFDdkUsT0FBTyxJQUFBLHdCQUFnQixFQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUFlLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLENBQUMsQ0FBQztBQWJXLFFBQUEsVUFBVSxjQWFyQjtBQUNGOztHQUVHO0FBQ1UsUUFBQSxXQUFXLEdBQUcsa0JBQVUsQ0FBQyJ9