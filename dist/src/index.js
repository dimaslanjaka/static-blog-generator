"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EJSRenderer = exports.getConfig = exports.parsePost = exports.buildPost = exports.globSrc = exports.dump = exports.copyPosts = exports.copyAssets = exports.clean_tmp = exports.clean_public = exports.clean_posts = exports.clean_db = exports.bindProcessExit = void 0;
var gulp_1 = __importDefault(require("gulp"));
require("./a-core");
require("./gulp/server");
require("./gulp/tasks/copy");
require("./gulp/tasks/deploy");
require("./gulp/tasks/generate");
var scheduler_1 = __importDefault(require("./node/scheduler"));
var scheduler_2 = require("./node/scheduler");
Object.defineProperty(exports, "bindProcessExit", { enumerable: true, get: function () { return scheduler_2.bindProcessExit; } });
var clean_1 = require("./gulp/tasks/clean");
Object.defineProperty(exports, "clean_db", { enumerable: true, get: function () { return clean_1.clean_db; } });
Object.defineProperty(exports, "clean_posts", { enumerable: true, get: function () { return clean_1.clean_posts; } });
Object.defineProperty(exports, "clean_public", { enumerable: true, get: function () { return clean_1.clean_public; } });
Object.defineProperty(exports, "clean_tmp", { enumerable: true, get: function () { return clean_1.clean_tmp; } });
var assets_1 = require("./gulp/tasks/copy/assets");
Object.defineProperty(exports, "copyAssets", { enumerable: true, get: function () { return assets_1.copyAssets; } });
var posts_1 = require("./gulp/tasks/copy/posts");
Object.defineProperty(exports, "copyPosts", { enumerable: true, get: function () { return posts_1.copyPosts; } });
var dump_1 = require("./gulp/tasks/dump");
Object.defineProperty(exports, "dump", { enumerable: true, get: function () { return dump_1.dump; } });
var filemanager_1 = require("./node/filemanager");
Object.defineProperty(exports, "globSrc", { enumerable: true, get: function () { return filemanager_1.globSrc; } });
var parsePost_1 = require("./parser/post/parsePost");
Object.defineProperty(exports, "buildPost", { enumerable: true, get: function () { return parsePost_1.buildPost; } });
Object.defineProperty(exports, "parsePost", { enumerable: true, get: function () { return parsePost_1.parsePost; } });
var _config_1 = require("./types/_config");
Object.defineProperty(exports, "getConfig", { enumerable: true, get: function () { return _config_1.getConfig; } });
var EJSRenderer_1 = require("./renderer/ejs/EJSRenderer");
Object.defineProperty(exports, "EJSRenderer", { enumerable: true, get: function () { return EJSRenderer_1.EJSRenderer; } });
// register scheduler
new scheduler_1.default();
/**
 * @see {@link https://stackoverflow.com/a/67394338/6404439}
 */
process.on('uncaughtException', function (err) {
    console.error('uncaughtException:\n' + err.stack + '\n');
});
// [task] DEFAULT
gulp_1.default.task('default', gulp_1.default.series('copy', 'generate'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLG9CQUFrQjtBQUNsQix5QkFBdUI7QUFDdkIsNkJBQTJCO0FBQzNCLCtCQUE2QjtBQUM3QixpQ0FBK0I7QUFDL0IsK0RBQXlDO0FBRXpDLDhDQUFtRDtBQUExQyw0R0FBQSxlQUFlLE9BQUE7QUFDeEIsNENBSzRCO0FBSjFCLGlHQUFBLFFBQVEsT0FBQTtBQUNSLG9HQUFBLFdBQVcsT0FBQTtBQUNYLHFHQUFBLFlBQVksT0FBQTtBQUNaLGtHQUFBLFNBQVMsT0FBQTtBQUVYLG1EQUFzRDtBQUE3QyxvR0FBQSxVQUFVLE9BQUE7QUFDbkIsaURBQW9EO0FBQTNDLGtHQUFBLFNBQVMsT0FBQTtBQUNsQiwwQ0FBeUM7QUFBaEMsNEZBQUEsSUFBSSxPQUFBO0FBQ2Isa0RBQTZDO0FBQXBDLHNHQUFBLE9BQU8sT0FBQTtBQUNoQixxREFPaUM7QUFOL0Isc0dBQUEsU0FBUyxPQUFBO0FBR1Qsc0dBQUEsU0FBUyxPQUFBO0FBSVgsMkNBQTRDO0FBQW5DLG9HQUFBLFNBQVMsT0FBQTtBQUNsQiwwREFBeUQ7QUFBaEQsMEdBQUEsV0FBVyxPQUFBO0FBRXBCLHFCQUFxQjtBQUNyQixJQUFJLG1CQUFTLEVBQUUsQ0FBQztBQUVoQjs7R0FFRztBQUNILE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxHQUFHO0lBQzNDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUMsQ0FBQztBQUVILGlCQUFpQjtBQUNqQixjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDIn0=