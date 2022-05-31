"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePost = exports.copyPosts = exports.copyAssets = exports.clean_tmp = exports.clean_public = exports.clean_posts = exports.clean_db = void 0;
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
require("./a-core");
require("./gulp/server");
require("./gulp/tasks/clean");
require("./gulp/tasks/copy");
require("./gulp/tasks/deploy");
require("./gulp/tasks/generate");
var scheduler_1 = __importDefault(require("./node/scheduler"));
var clean_1 = require("./gulp/tasks/clean");
Object.defineProperty(exports, "clean_db", { enumerable: true, get: function () { return clean_1.clean_db; } });
Object.defineProperty(exports, "clean_posts", { enumerable: true, get: function () { return clean_1.clean_posts; } });
Object.defineProperty(exports, "clean_public", { enumerable: true, get: function () { return clean_1.clean_public; } });
Object.defineProperty(exports, "clean_tmp", { enumerable: true, get: function () { return clean_1.clean_tmp; } });
var assets_1 = require("./gulp/tasks/copy/assets");
Object.defineProperty(exports, "copyAssets", { enumerable: true, get: function () { return assets_1.copyAssets; } });
var posts_1 = require("./gulp/tasks/copy/posts");
Object.defineProperty(exports, "copyPosts", { enumerable: true, get: function () { return posts_1.copyPosts; } });
var parsePost_1 = require("./parser/post/parsePost");
Object.defineProperty(exports, "parsePost", { enumerable: true, get: function () { return parsePost_1.parsePost; } });
// register scheduler
new scheduler_1.default();
/**
 * @see {@link https://stackoverflow.com/a/67394338/6404439}
 */
process.on('uncaughtException', function (err) {
    console.error('uncaughtException:\n' + err.stack + '\n');
});
// [task] DEVELOPMENT
require((0, upath_1.join)(__dirname, 'gulp/tasks/dump'));
// [task] DEFAULT
gulp_1.default.task('default', gulp_1.default.series('copy', 'generate'));
exports.default = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLCtCQUE2QjtBQUM3QixvQkFBa0I7QUFDbEIseUJBQXVCO0FBQ3ZCLDhCQUE0QjtBQUM1Qiw2QkFBMkI7QUFDM0IsK0JBQTZCO0FBQzdCLGlDQUErQjtBQUMvQiwrREFBeUM7QUFDekMsNENBSzRCO0FBSjFCLGlHQUFBLFFBQVEsT0FBQTtBQUNSLG9HQUFBLFdBQVcsT0FBQTtBQUNYLHFHQUFBLFlBQVksT0FBQTtBQUNaLGtHQUFBLFNBQVMsT0FBQTtBQUVYLG1EQUFzRDtBQUE3QyxvR0FBQSxVQUFVLE9BQUE7QUFDbkIsaURBQW9EO0FBQTNDLGtHQUFBLFNBQVMsT0FBQTtBQUNsQixxREFBb0Q7QUFBM0Msc0dBQUEsU0FBUyxPQUFBO0FBRWxCLHFCQUFxQjtBQUNyQixJQUFJLG1CQUFTLEVBQUUsQ0FBQztBQUVoQjs7R0FFRztBQUNILE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxHQUFHO0lBQzNDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUMsQ0FBQztBQUVILHFCQUFxQjtBQUNyQixPQUFPLENBQUMsSUFBQSxZQUFJLEVBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUU1QyxpQkFBaUI7QUFDakIsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUV0RCxrQkFBZSxFQUFFLENBQUMifQ==