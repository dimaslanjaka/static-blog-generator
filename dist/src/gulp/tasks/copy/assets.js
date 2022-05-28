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
var gulp = __importStar(require("gulp"));
var color_1 = __importDefault(require("../../../node/color"));
var _config_1 = require("../../../types/_config");
var utils_1 = require("../../utils");
/**
 * copy src-post assets to source/_posts
 * @returns
 */
var copyAssets = function () {
    console.log("".concat(color_1.default.magentaBright('[copy][assets]'), " cwd=").concat(color_1.default.Mahogany(_config_1.post_source_dir), " dest=").concat(color_1.default['Granny Smith Apple'](_config_1.post_public_dir)));
    var run = gulp.src(['**/*.*', "!**/*.md"], { cwd: _config_1.post_source_dir });
    return (0, utils_1.determineDirname)(run).pipe(gulp.dest(_config_1.post_public_dir));
};
exports.copyAssets = copyAssets;
/**
 * @see {@link copyAssets}
 */
exports.copy_assets = exports.copyAssets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvY29weS9hc3NldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNkI7QUFDN0IsOERBQXdDO0FBQ3hDLGtEQUEwRTtBQUMxRSxxQ0FBK0M7QUFFL0M7OztHQUdHO0FBQ0ksSUFBTSxVQUFVLEdBQUc7SUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxVQUFHLGVBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsa0JBQVEsZUFBSyxDQUFDLFFBQVEsQ0FDNUQseUJBQWUsQ0FDaEIsbUJBQVMsZUFBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMseUJBQWUsQ0FBQyxDQUFFLENBQ3pELENBQUM7SUFDRixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLHlCQUFlLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLE9BQU8sSUFBQSx3QkFBZ0IsRUFBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBZSxDQUFDLENBQUMsQ0FBQztBQUNoRSxDQUFDLENBQUM7QUFSVyxRQUFBLFVBQVUsY0FRckI7QUFDRjs7R0FFRztBQUNVLFFBQUEsV0FBVyxHQUFHLGtCQUFVLENBQUMifQ==