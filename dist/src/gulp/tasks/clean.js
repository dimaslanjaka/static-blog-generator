"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean_db = exports.clean_tmp = exports.clean_posts = exports.clean_public = void 0;
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var process_1 = require("process");
var upath_1 = require("upath");
var cache_1 = require("../../node/cache");
var _config_1 = require("../../types/_config");
/** clean generated folder */
var clean_public = function (done) {
    return (0, fs_1.rm)(_config_1.post_generated_dir, { recursive: true, force: true }, function () { return done(); });
};
exports.clean_public = clean_public;
/** clean posts from config.source_dir */
var clean_posts = function (done) {
    return (0, fs_1.rm)(_config_1.post_public_dir, { recursive: true, force: true }, function () { return done(); });
};
exports.clean_posts = clean_posts;
/** clean temp folder */
var clean_tmp = function (done) {
    (0, fs_1.rm)((0, _config_1.tmp)(), { recursive: true, force: true }, function () {
        (0, fs_1.rm)((0, upath_1.join)((0, process_1.cwd)(), 'tmp'), { recursive: true, force: true }, function () {
            done();
        });
    });
};
exports.clean_tmp = clean_tmp;
/** clean database folder */
var clean_db = function (done) {
    return (0, fs_1.rm)(cache_1.dbFolder, { recursive: true, force: true }, function () { return done(); });
};
exports.clean_db = clean_db;
// [task] CLEAN
gulp_1.default.task('clean:public', exports.clean_public);
gulp_1.default.task('clean:posts', exports.clean_posts);
gulp_1.default.task('clean:db', exports.clean_db);
gulp_1.default.task('clean:tmp', exports.clean_tmp);
gulp_1.default.task('clean', gulp_1.default.parallel('clean:db', 'clean:tmp', 'clean:posts', 'clean:public'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9jbGVhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBd0I7QUFDeEIsOENBQXdCO0FBQ3hCLG1DQUE4QjtBQUU5QiwrQkFBNkI7QUFDN0IsMENBQTRDO0FBQzVDLCtDQUErRTtBQUUvRSw2QkFBNkI7QUFDdEIsSUFBTSxZQUFZLEdBQUcsVUFBQyxJQUFtQjtJQUM5QyxPQUFBLElBQUEsT0FBRSxFQUFDLDRCQUFrQixFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQztBQUF0RSxDQUFzRSxDQUFDO0FBRDVELFFBQUEsWUFBWSxnQkFDZ0Q7QUFDekUseUNBQXlDO0FBQ2xDLElBQU0sV0FBVyxHQUFHLFVBQUMsSUFBbUI7SUFDN0MsT0FBQSxJQUFBLE9BQUUsRUFBQyx5QkFBZSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQztBQUFuRSxDQUFtRSxDQUFDO0FBRHpELFFBQUEsV0FBVyxlQUM4QztBQUN0RSx3QkFBd0I7QUFDakIsSUFBTSxTQUFTLEdBQUcsVUFBQyxJQUFtQjtJQUMzQyxJQUFBLE9BQUUsRUFBQyxJQUFBLGFBQUcsR0FBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDMUMsSUFBQSxPQUFFLEVBQUMsSUFBQSxZQUFJLEVBQUMsSUFBQSxhQUFHLEdBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3ZELElBQUksRUFBRSxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQU5XLFFBQUEsU0FBUyxhQU1wQjtBQUNGLDRCQUE0QjtBQUNyQixJQUFNLFFBQVEsR0FBRyxVQUFDLElBQW1CO0lBQzFDLE9BQUEsSUFBQSxPQUFFLEVBQUMsZ0JBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLGNBQU0sT0FBQSxJQUFJLEVBQUUsRUFBTixDQUFNLENBQUM7QUFBNUQsQ0FBNEQsQ0FBQztBQURsRCxRQUFBLFFBQVEsWUFDMEM7QUFFL0QsZUFBZTtBQUNmLGNBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLG9CQUFZLENBQUMsQ0FBQztBQUN4QyxjQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxtQkFBVyxDQUFDLENBQUM7QUFDdEMsY0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsZ0JBQVEsQ0FBQyxDQUFDO0FBQ2hDLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGlCQUFTLENBQUMsQ0FBQztBQUNsQyxjQUFJLENBQUMsSUFBSSxDQUNQLE9BQU8sRUFDUCxjQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUN0RSxDQUFDIn0=