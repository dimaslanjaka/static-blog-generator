"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePost = exports.buildPost = exports.dump = exports.copyPosts = exports.copyAssets = exports.clean_tmp = exports.clean_public = exports.clean_posts = exports.clean_db = void 0;
var gulp_1 = __importDefault(require("gulp"));
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
var dump_1 = require("./gulp/tasks/dump");
Object.defineProperty(exports, "dump", { enumerable: true, get: function () { return dump_1.dump; } });
var parsePost_1 = require("./parser/post/parsePost");
Object.defineProperty(exports, "buildPost", { enumerable: true, get: function () { return parsePost_1.buildPost; } });
Object.defineProperty(exports, "parsePost", { enumerable: true, get: function () { return parsePost_1.parsePost; } });
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
exports.default = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLG9CQUFrQjtBQUNsQix5QkFBdUI7QUFDdkIsOEJBQTRCO0FBQzVCLDZCQUEyQjtBQUMzQiwrQkFBNkI7QUFDN0IsaUNBQStCO0FBQy9CLCtEQUF5QztBQUN6Qyw0Q0FLNEI7QUFKMUIsaUdBQUEsUUFBUSxPQUFBO0FBQ1Isb0dBQUEsV0FBVyxPQUFBO0FBQ1gscUdBQUEsWUFBWSxPQUFBO0FBQ1osa0dBQUEsU0FBUyxPQUFBO0FBRVgsbURBQXNEO0FBQTdDLG9HQUFBLFVBQVUsT0FBQTtBQUNuQixpREFBb0Q7QUFBM0Msa0dBQUEsU0FBUyxPQUFBO0FBQ2xCLDBDQUF5QztBQUFoQyw0RkFBQSxJQUFJLE9BQUE7QUFDYixxREFPaUM7QUFOL0Isc0dBQUEsU0FBUyxPQUFBO0FBR1Qsc0dBQUEsU0FBUyxPQUFBO0FBS1gscUJBQXFCO0FBQ3JCLElBQUksbUJBQVMsRUFBRSxDQUFDO0FBRWhCOztHQUVHO0FBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLEdBQUc7SUFDM0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQyxDQUFDO0FBRUgsaUJBQWlCO0FBQ2pCLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFFdEQsa0JBQWUsRUFBRSxDQUFDIn0=