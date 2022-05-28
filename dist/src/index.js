"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gulp_1 = __importDefault(require("gulp"));
var server_1 = require("./gulp/server");
var clean_1 = require("./gulp/tasks/clean");
var copy_1 = require("./gulp/tasks/copy");
var assets_1 = require("./gulp/tasks/copy/assets");
var remove_inline_style_1 = require("./gulp/tasks/copy/remove-inline-style");
require("./gulp/tasks/deploy");
require("./gulp/tasks/dump");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBd0I7QUFDeEIsd0NBQTRDO0FBQzVDLDRDQUs0QjtBQUM1QiwwQ0FBOEM7QUFDOUMsbURBQXNEO0FBQ3RELDZFQUF3RTtBQUN4RSwrQkFBNkI7QUFDN0IsNkJBQTJCO0FBQzNCLGlDQUErQjtBQUMvQiwrREFBeUM7QUFFekMscUJBQXFCO0FBQ3JCLElBQUksbUJBQVMsRUFBRSxDQUFDO0FBRWhCOztHQUVHO0FBQ0gsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLEdBQUc7SUFDM0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBYTtBQUNiLGNBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLG1CQUFVLENBQUMsQ0FBQztBQUNyQyxjQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxjQUFNLE9BQUEsSUFBQSxnQkFBUyxHQUFFLEVBQVgsQ0FBVyxDQUFDLENBQUM7QUFDM0MsY0FBSSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxxQ0FBZSxDQUFDLENBQUM7QUFDdkQsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUM1RCxjQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLENBQUM7QUFFM0UsZUFBZTtBQUNmLGNBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLG9CQUFXLENBQUMsQ0FBQztBQUNqQyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFFMUMsY0FBYztBQUNkLGNBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLG9CQUFZLENBQUMsQ0FBQztBQUN4QyxjQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxtQkFBVyxDQUFDLENBQUM7QUFDdEMsY0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsZ0JBQVEsQ0FBQyxDQUFDO0FBQ2hDLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGlCQUFTLENBQUMsQ0FBQztBQUNsQyxjQUFJLENBQUMsSUFBSSxDQUNQLE9BQU8sRUFDUCxjQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUN0RSxDQUFDO0FBRUYsZUFBZTtBQUNmLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMifQ==