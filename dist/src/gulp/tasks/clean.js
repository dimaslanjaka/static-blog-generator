"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean_db = exports.clean_tmp = exports.clean_posts = exports.clean_public = void 0;
var fs_1 = require("fs");
var process_1 = require("process");
var upath_1 = require("upath");
var cache_1 = require("../../node/cache");
var _config_1 = require("../../types/_config");
/** clean generated folder */
var clean_public = function (done) {
    return (0, fs_1.rm)(_config_1.post_generated_dir, { recursive: true }, function () { return done(); });
};
exports.clean_public = clean_public;
/** clean posts from config.source_dir */
var clean_posts = function (done) {
    return (0, fs_1.rm)(_config_1.post_public_dir, { recursive: true }, function () { return done(); });
};
exports.clean_posts = clean_posts;
/** clean temp folder */
var clean_tmp = function (done) {
    (0, fs_1.rm)((0, _config_1.tmp)(), { recursive: true }, function () {
        (0, fs_1.rm)((0, upath_1.join)((0, process_1.cwd)(), 'tmp'), { recursive: true }, function () {
            done();
        });
    });
};
exports.clean_tmp = clean_tmp;
/** clean database folder */
var clean_db = function (done) {
    return (0, fs_1.rm)(cache_1.dbFolder, { recursive: true }, function () { return done(); });
};
exports.clean_db = clean_db;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9jbGVhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBd0I7QUFDeEIsbUNBQThCO0FBRTlCLCtCQUE2QjtBQUM3QiwwQ0FBNEM7QUFDNUMsK0NBQStFO0FBRS9FLDZCQUE2QjtBQUN0QixJQUFNLFlBQVksR0FBRyxVQUFDLElBQW1CO0lBQzlDLE9BQUEsSUFBQSxPQUFFLEVBQUMsNEJBQWtCLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQztBQUF6RCxDQUF5RCxDQUFDO0FBRC9DLFFBQUEsWUFBWSxnQkFDbUM7QUFDNUQseUNBQXlDO0FBQ2xDLElBQU0sV0FBVyxHQUFHLFVBQUMsSUFBbUI7SUFDN0MsT0FBQSxJQUFBLE9BQUUsRUFBQyx5QkFBZSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLGNBQU0sT0FBQSxJQUFJLEVBQUUsRUFBTixDQUFNLENBQUM7QUFBdEQsQ0FBc0QsQ0FBQztBQUQ1QyxRQUFBLFdBQVcsZUFDaUM7QUFDekQsd0JBQXdCO0FBQ2pCLElBQU0sU0FBUyxHQUFHLFVBQUMsSUFBbUI7SUFDM0MsSUFBQSxPQUFFLEVBQUMsSUFBQSxhQUFHLEdBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUM3QixJQUFBLE9BQUUsRUFBQyxJQUFBLFlBQUksRUFBQyxJQUFBLGFBQUcsR0FBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzFDLElBQUksRUFBRSxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQU5XLFFBQUEsU0FBUyxhQU1wQjtBQUNGLDRCQUE0QjtBQUNyQixJQUFNLFFBQVEsR0FBRyxVQUFDLElBQW1CO0lBQzFDLE9BQUEsSUFBQSxPQUFFLEVBQUMsZ0JBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxjQUFNLE9BQUEsSUFBSSxFQUFFLEVBQU4sQ0FBTSxDQUFDO0FBQS9DLENBQStDLENBQUM7QUFEckMsUUFBQSxRQUFRLFlBQzZCIn0=