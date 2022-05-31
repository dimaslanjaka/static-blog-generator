"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gulp_1 = __importDefault(require("gulp"));
var assets_1 = require("./assets");
var posts_1 = require("./posts");
var remove_inline_style_1 = require("./remove-inline-style");
// COPY TASKS
gulp_1.default.task('copy:assets', function () { return (0, assets_1.copyAssets)(); });
gulp_1.default.task('copy:posts', function () { return (0, posts_1.copyPosts)(); });
gulp_1.default.task('copy:remove-inline-style', function () { return (0, remove_inline_style_1.gulpInlineStyle)(); });
gulp_1.default.task('copy', gulp_1.default.series('copy:assets', 'copy:posts'));
gulp_1.default.task('copy:blogger', gulp_1.default.series('copy', 'copy:remove-inline-style'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9jb3B5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLG1DQUFzQztBQUN0QyxpQ0FBb0M7QUFDcEMsNkRBQXdEO0FBRXhELGFBQWE7QUFDYixjQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxjQUFNLE9BQUEsSUFBQSxtQkFBVSxHQUFFLEVBQVosQ0FBWSxDQUFDLENBQUM7QUFDN0MsY0FBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsY0FBTSxPQUFBLElBQUEsaUJBQVMsR0FBRSxFQUFYLENBQVcsQ0FBQyxDQUFDO0FBQzNDLGNBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsY0FBTSxPQUFBLElBQUEscUNBQWUsR0FBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7QUFDL0QsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUM1RCxjQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLENBQUMifQ==