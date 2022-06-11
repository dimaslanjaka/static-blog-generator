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
exports.clean_db = exports.clean_tmp = exports.clean_posts = exports.clean_public = void 0;
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var process_1 = require("process");
var upath_1 = require("upath");
var hexo_1 = require("../../db/hexo");
var cache_1 = require("../../node/cache");
var _config_1 = __importStar(require("../../types/_config"));
/** clean generated folder */
var clean_public = function (done) {
    return (0, fs_1.rm)(_config_1.post_generated_dir, { recursive: true, force: true }, function () { return done(); });
};
exports.clean_public = clean_public;
/** clean posts from config.source_dir */
var clean_posts = function (done) {
    (0, fs_1.rm)(_config_1.post_public_dir, { recursive: true, force: true }, function () {
        if ('generator' in _config_1.default && _config_1.default['generator']['type'] === 'hexo') {
            (0, fs_1.rm)(hexo_1.HexoDBPath, function () { return done(); });
        }
        else {
            done();
        }
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9jbGVhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlCQUF3QjtBQUN4Qiw4Q0FBd0I7QUFDeEIsbUNBQThCO0FBRTlCLCtCQUE2QjtBQUM3QixzQ0FBMkM7QUFDM0MsMENBQTRDO0FBQzVDLDZEQUk2QjtBQUU3Qiw2QkFBNkI7QUFDdEIsSUFBTSxZQUFZLEdBQUcsVUFBQyxJQUFtQjtJQUM5QyxPQUFBLElBQUEsT0FBRSxFQUFDLDRCQUFrQixFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQztBQUF0RSxDQUFzRSxDQUFDO0FBRDVELFFBQUEsWUFBWSxnQkFDZ0Q7QUFDekUseUNBQXlDO0FBQ2xDLElBQU0sV0FBVyxHQUFHLFVBQUMsSUFBbUI7SUFDN0MsSUFBQSxPQUFFLEVBQUMseUJBQWUsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3BELElBQUksV0FBVyxJQUFJLGlCQUFNLElBQUksaUJBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxNQUFNLEVBQUU7WUFDbkUsSUFBQSxPQUFFLEVBQUMsaUJBQVUsRUFBRSxjQUFNLE9BQUEsSUFBSSxFQUFFLEVBQU4sQ0FBTSxDQUFDLENBQUM7U0FDOUI7YUFBTTtZQUNMLElBQUksRUFBRSxDQUFDO1NBQ1I7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQVJXLFFBQUEsV0FBVyxlQVF0QjtBQUNGLHdCQUF3QjtBQUNqQixJQUFNLFNBQVMsR0FBRyxVQUFDLElBQW1CO0lBQzNDLElBQUEsT0FBRSxFQUFDLElBQUEsYUFBRyxHQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUMxQyxJQUFBLE9BQUUsRUFBQyxJQUFBLFlBQUksRUFBQyxJQUFBLGFBQUcsR0FBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdkQsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBTlcsUUFBQSxTQUFTLGFBTXBCO0FBQ0YsNEJBQTRCO0FBQ3JCLElBQU0sUUFBUSxHQUFHLFVBQUMsSUFBbUI7SUFDMUMsT0FBQSxJQUFBLE9BQUUsRUFBQyxnQkFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQztBQUE1RCxDQUE0RCxDQUFDO0FBRGxELFFBQUEsUUFBUSxZQUMwQztBQUUvRCxlQUFlO0FBQ2YsY0FBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsb0JBQVksQ0FBQyxDQUFDO0FBQ3hDLGNBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLG1CQUFXLENBQUMsQ0FBQztBQUN0QyxjQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxnQkFBUSxDQUFDLENBQUM7QUFDaEMsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsaUJBQVMsQ0FBQyxDQUFDO0FBQ2xDLGNBQUksQ0FBQyxJQUFJLENBQ1AsT0FBTyxFQUNQLGNBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQ3RFLENBQUMifQ==