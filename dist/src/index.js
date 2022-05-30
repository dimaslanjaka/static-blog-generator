"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean_tmp = exports.clean_public = exports.clean_posts = exports.clean_db = exports.gulpInlineStyle = exports.copyAssets = exports.copyPosts = void 0;
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var server_1 = require("./gulp/server");
var clean_1 = require("./gulp/tasks/clean");
Object.defineProperty(exports, "clean_db", { enumerable: true, get: function () { return clean_1.clean_db; } });
Object.defineProperty(exports, "clean_posts", { enumerable: true, get: function () { return clean_1.clean_posts; } });
Object.defineProperty(exports, "clean_public", { enumerable: true, get: function () { return clean_1.clean_public; } });
Object.defineProperty(exports, "clean_tmp", { enumerable: true, get: function () { return clean_1.clean_tmp; } });
var copy_1 = require("./gulp/tasks/copy");
Object.defineProperty(exports, "copyPosts", { enumerable: true, get: function () { return copy_1.copyPosts; } });
var assets_1 = require("./gulp/tasks/copy/assets");
Object.defineProperty(exports, "copyAssets", { enumerable: true, get: function () { return assets_1.copyAssets; } });
var remove_inline_style_1 = require("./gulp/tasks/copy/remove-inline-style");
Object.defineProperty(exports, "gulpInlineStyle", { enumerable: true, get: function () { return remove_inline_style_1.gulpInlineStyle; } });
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
require((0, upath_1.join)(__dirname, 'gulp/tasks/dump'));
// COPY TASKS
gulp_1.default.task('copy:assets', assets_1.copyAssets);
gulp_1.default.task('copy:posts', function () { return (0, copy_1.copyPosts)(); });
gulp_1.default.task('copy:remove-inline-style', remove_inline_style_1.gulpInlineStyle);
gulp_1.default.task('copy', gulp_1.default.series('copy:assets', 'copy:posts'));
gulp_1.default.task('copy:blogger', gulp_1.default.series('copy', 'copy:remove-inline-style'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLCtCQUE2QjtBQUM3Qix3Q0FBNEM7QUFDNUMsNENBSzRCO0FBa0QxQix5RkF0REEsZ0JBQVEsT0FzREE7QUFDUiw0RkF0REEsbUJBQVcsT0FzREE7QUFDWCw2RkF0REEsb0JBQVksT0FzREE7QUFDWiwwRkF0REEsaUJBQVMsT0FzREE7QUFwRFgsMENBQThDO0FBOEM1QywwRkE5Q08sZ0JBQVMsT0E4Q1A7QUE3Q1gsbURBQXNEO0FBOENwRCwyRkE5Q08sbUJBQVUsT0E4Q1A7QUE3Q1osNkVBQXdFO0FBOEN0RSxnR0E5Q08scUNBQWUsT0E4Q1A7QUE3Q2pCLCtCQUE2QjtBQUM3QixpQ0FBK0I7QUFDL0IsK0RBQXlDO0FBRXpDLHFCQUFxQjtBQUNyQixJQUFJLG1CQUFTLEVBQUUsQ0FBQztBQUVoQjs7R0FFRztBQUNILE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxHQUFHO0lBQzNDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUMsQ0FBQztBQUlILE9BQU8sQ0FBQyxJQUFBLFlBQUksRUFBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBRTVDLGFBQWE7QUFDYixjQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxtQkFBVSxDQUFDLENBQUM7QUFDckMsY0FBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsY0FBTSxPQUFBLElBQUEsZ0JBQVMsR0FBRSxFQUFYLENBQVcsQ0FBQyxDQUFDO0FBQzNDLGNBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUscUNBQWUsQ0FBQyxDQUFDO0FBQ3ZELGNBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7QUFDNUQsY0FBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBRTNFLGVBQWU7QUFDZixjQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxvQkFBVyxDQUFDLENBQUM7QUFDakMsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBRTFDLGNBQWM7QUFDZCxjQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxvQkFBWSxDQUFDLENBQUM7QUFDeEMsY0FBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsbUJBQVcsQ0FBQyxDQUFDO0FBQ3RDLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFRLENBQUMsQ0FBQztBQUNoQyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxpQkFBUyxDQUFDLENBQUM7QUFDbEMsY0FBSSxDQUFDLElBQUksQ0FDUCxPQUFPLEVBQ1AsY0FBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FDdEUsQ0FBQztBQUVGLGVBQWU7QUFDZixjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDIn0=