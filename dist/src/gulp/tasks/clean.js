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
    return (0, fs_1.rm)(_config_1.post_generated_dir, { recursive: true, force: true }, function () {
        if (typeof done === 'function')
            done();
    });
};
exports.clean_public = clean_public;
/** clean posts from config.source_dir */
var clean_posts = function (done) {
    (0, fs_1.rm)(_config_1.post_public_dir, { recursive: true, force: true }, function () {
        if ('generator' in _config_1.default && _config_1.default['generator']['type'] === 'hexo') {
            (0, fs_1.rm)(hexo_1.HexoDBPath, function () {
                if (typeof done === 'function')
                    done();
            });
        }
        else {
            if (typeof done === 'function')
                done();
        }
    });
};
exports.clean_posts = clean_posts;
/** clean temp folder */
var clean_tmp = function (done) {
    (0, fs_1.rm)((0, _config_1.tmp)(), { recursive: true, force: true }, function () {
        (0, fs_1.rm)((0, upath_1.join)((0, process_1.cwd)(), 'tmp'), { recursive: true, force: true }, function () {
            if (typeof done === 'function')
                done();
        });
    });
};
exports.clean_tmp = clean_tmp;
/** clean database folder */
var clean_db = function (done) {
    return (0, fs_1.rm)(cache_1.dbFolder, { recursive: true, force: true }, function () {
        if (typeof done === 'function')
            done();
    });
};
exports.clean_db = clean_db;
// [task] CLEAN
gulp_1.default.task('clean:public', exports.clean_public);
gulp_1.default.task('clean:posts', exports.clean_posts);
gulp_1.default.task('clean:db', exports.clean_db);
gulp_1.default.task('clean:tmp', exports.clean_tmp);
gulp_1.default.task('clean', gulp_1.default.parallel('clean:db', 'clean:tmp', 'clean:posts', 'clean:public'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9jbGVhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlCQUF3QjtBQUN4Qiw4Q0FBd0I7QUFDeEIsbUNBQThCO0FBRTlCLCtCQUE2QjtBQUM3QixzQ0FBMkM7QUFDM0MsMENBQTRDO0FBQzVDLDZEQUk2QjtBQUU3Qiw2QkFBNkI7QUFDdEIsSUFBTSxZQUFZLEdBQUcsVUFBQyxJQUFtQjtJQUM5QyxPQUFBLElBQUEsT0FBRSxFQUFDLDRCQUFrQixFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDdkQsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVO1lBQUUsSUFBSSxFQUFFLENBQUM7SUFDekMsQ0FBQyxDQUFDO0FBRkYsQ0FFRSxDQUFDO0FBSFEsUUFBQSxZQUFZLGdCQUdwQjtBQUNMLHlDQUF5QztBQUNsQyxJQUFNLFdBQVcsR0FBRyxVQUFDLElBQW1CO0lBQzdDLElBQUEsT0FBRSxFQUFDLHlCQUFlLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNwRCxJQUFJLFdBQVcsSUFBSSxpQkFBTSxJQUFJLGlCQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssTUFBTSxFQUFFO1lBQ25FLElBQUEsT0FBRSxFQUFDLGlCQUFVLEVBQUU7Z0JBQ2IsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVO29CQUFFLElBQUksRUFBRSxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksT0FBTyxJQUFJLEtBQUssVUFBVTtnQkFBRSxJQUFJLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBVlcsUUFBQSxXQUFXLGVBVXRCO0FBQ0Ysd0JBQXdCO0FBQ2pCLElBQU0sU0FBUyxHQUFHLFVBQUMsSUFBbUI7SUFDM0MsSUFBQSxPQUFFLEVBQUMsSUFBQSxhQUFHLEdBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQzFDLElBQUEsT0FBRSxFQUFDLElBQUEsWUFBSSxFQUFDLElBQUEsYUFBRyxHQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN2RCxJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVU7Z0JBQUUsSUFBSSxFQUFFLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQU5XLFFBQUEsU0FBUyxhQU1wQjtBQUNGLDRCQUE0QjtBQUNyQixJQUFNLFFBQVEsR0FBRyxVQUFDLElBQW1CO0lBQzFDLE9BQUEsSUFBQSxPQUFFLEVBQUMsZ0JBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQzdDLElBQUksT0FBTyxJQUFJLEtBQUssVUFBVTtZQUFFLElBQUksRUFBRSxDQUFDO0lBQ3pDLENBQUMsQ0FBQztBQUZGLENBRUUsQ0FBQztBQUhRLFFBQUEsUUFBUSxZQUdoQjtBQUVMLGVBQWU7QUFDZixjQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxvQkFBWSxDQUFDLENBQUM7QUFDeEMsY0FBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsbUJBQVcsQ0FBQyxDQUFDO0FBQ3RDLGNBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFRLENBQUMsQ0FBQztBQUNoQyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxpQkFBUyxDQUFDLENBQUM7QUFDbEMsY0FBSSxDQUFDLElBQUksQ0FDUCxPQUFPLEVBQ1AsY0FBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FDdEUsQ0FBQyJ9