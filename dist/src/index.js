"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyPosts = exports.copyAssets = exports.clean_tmp = exports.clean_public = exports.clean_posts = exports.clean_db = void 0;
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
require("./a_folder_solver");
var server_1 = require("./gulp/server");
var clean_1 = require("./gulp/tasks/clean");
require("./gulp/tasks/copy");
require("./gulp/tasks/deploy");
require("./gulp/tasks/generate");
var scheduler_1 = __importDefault(require("./node/scheduler"));
// register scheduler
new scheduler_1.default();
/**
 * @see {@link https://stackoverflow.com/a/67394338/6404439}
 */
process.on('uncaughtException', function (err) {
    console.error('uncaughtException:\n' + err.stack + '\n');
});
// DEVELOPMENT TASKS
require((0, upath_1.join)(__dirname, 'gulp/tasks/dump'));
// LOCAL SERVER
gulp_1.default.task('server', server_1.localServer);
gulp_1.default.task('serve', gulp_1.default.series('server'));
// CLEAN TASKS
gulp_1.default.task('clean:public', clean_1.clean_public);
gulp_1.default.task('clean:posts', clean_1.clean_posts);
gulp_1.default.task('clean:db', clean_1.clean_db);
gulp_1.default.task('clean:tmp', clean_1.clean_tmp);
gulp_1.default.task('clean', gulp_1.default.parallel('clean:db', 'clean:tmp', 'clean:posts', 'clean:public'));
// DEFAULT TASK
gulp_1.default.task('default', gulp_1.default.series('copy', 'generate'));
var clean_2 = require("./gulp/tasks/clean");
Object.defineProperty(exports, "clean_db", { enumerable: true, get: function () { return clean_2.clean_db; } });
Object.defineProperty(exports, "clean_posts", { enumerable: true, get: function () { return clean_2.clean_posts; } });
Object.defineProperty(exports, "clean_public", { enumerable: true, get: function () { return clean_2.clean_public; } });
Object.defineProperty(exports, "clean_tmp", { enumerable: true, get: function () { return clean_2.clean_tmp; } });
var assets_1 = require("./gulp/tasks/copy/assets");
Object.defineProperty(exports, "copyAssets", { enumerable: true, get: function () { return assets_1.copyAssets; } });
var posts_1 = require("./gulp/tasks/copy/posts");
Object.defineProperty(exports, "copyPosts", { enumerable: true, get: function () { return posts_1.copyPosts; } });
exports.default = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLCtCQUE2QjtBQUM3Qiw2QkFBMkI7QUFDM0Isd0NBQTRDO0FBQzVDLDRDQUs0QjtBQUM1Qiw2QkFBMkI7QUFDM0IsK0JBQTZCO0FBQzdCLGlDQUErQjtBQUMvQiwrREFBeUM7QUFLekMscUJBQXFCO0FBQ3JCLElBQUksbUJBQVMsRUFBRSxDQUFDO0FBRWhCOztHQUVHO0FBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLEdBQUc7SUFDM0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQyxDQUFDO0FBRUgsb0JBQW9CO0FBQ3BCLE9BQU8sQ0FBQyxJQUFBLFlBQUksRUFBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBRTVDLGVBQWU7QUFDZixjQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxvQkFBVyxDQUFDLENBQUM7QUFDakMsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBRTFDLGNBQWM7QUFDZCxjQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxvQkFBWSxDQUFDLENBQUM7QUFDeEMsY0FBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsbUJBQVcsQ0FBQyxDQUFDO0FBQ3RDLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFRLENBQUMsQ0FBQztBQUNoQyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxpQkFBUyxDQUFDLENBQUM7QUFDbEMsY0FBSSxDQUFDLElBQUksQ0FDUCxPQUFPLEVBQ1AsY0FBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FDdEUsQ0FBQztBQUVGLGVBQWU7QUFDZixjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBRXRELDRDQUs0QjtBQUoxQixpR0FBQSxRQUFRLE9BQUE7QUFDUixvR0FBQSxXQUFXLE9BQUE7QUFDWCxxR0FBQSxZQUFZLE9BQUE7QUFDWixrR0FBQSxTQUFTLE9BQUE7QUFFWCxtREFBc0Q7QUFBN0Msb0dBQUEsVUFBVSxPQUFBO0FBQ25CLGlEQUFvRDtBQUEzQyxrR0FBQSxTQUFTLE9BQUE7QUFFbEIsa0JBQWUsRUFBRSxDQUFDIn0=