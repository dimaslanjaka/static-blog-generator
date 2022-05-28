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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean_db = exports.clean_tmp = exports.clean_posts = exports.clean_public = void 0;
var fs_1 = require("fs");
var process_1 = require("process");
var upath_1 = require("upath");
var cache_1 = require("../../node/cache");
var _config_1 = __importStar(require("../../types/_config"));
/** clean generated folder */
var clean_public = function (done) {
    return (0, fs_1.rm)((0, upath_1.join)(_config_1.root, _config_1.default.public_dir), { recursive: true }, function () { return done(); });
};
exports.clean_public = clean_public;
/** clean posts from config.source_dir */
var clean_posts = function (done) {
    return (0, fs_1.rm)((0, upath_1.join)(_config_1.root, _config_1.default.source_dir, '_posts'), { recursive: true }, function () {
        return done();
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC90YXNrcy9jbGVhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlCQUF3QjtBQUN4QixtQ0FBOEI7QUFFOUIsK0JBQTZCO0FBQzdCLDBDQUE0QztBQUM1Qyw2REFBd0Q7QUFFeEQsNkJBQTZCO0FBQ3RCLElBQU0sWUFBWSxHQUFHLFVBQUMsSUFBbUI7SUFDOUMsT0FBQSxJQUFBLE9BQUUsRUFBQyxJQUFBLFlBQUksRUFBQyxjQUFJLEVBQUUsaUJBQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxjQUFNLE9BQUEsSUFBSSxFQUFFLEVBQU4sQ0FBTSxDQUFDO0FBQXBFLENBQW9FLENBQUM7QUFEMUQsUUFBQSxZQUFZLGdCQUM4QztBQUN2RSx5Q0FBeUM7QUFDbEMsSUFBTSxXQUFXLEdBQUcsVUFBQyxJQUFtQjtJQUM3QyxPQUFBLElBQUEsT0FBRSxFQUFDLElBQUEsWUFBSSxFQUFDLGNBQUksRUFBRSxpQkFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUMvRCxPQUFBLElBQUksRUFBRTtJQUFOLENBQU0sQ0FDUDtBQUZELENBRUMsQ0FBQztBQUhTLFFBQUEsV0FBVyxlQUdwQjtBQUNKLHdCQUF3QjtBQUNqQixJQUFNLFNBQVMsR0FBRyxVQUFDLElBQW1CO0lBQzNDLElBQUEsT0FBRSxFQUFDLElBQUEsYUFBRyxHQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDN0IsSUFBQSxPQUFFLEVBQUMsSUFBQSxZQUFJLEVBQUMsSUFBQSxhQUFHLEdBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMxQyxJQUFJLEVBQUUsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFOVyxRQUFBLFNBQVMsYUFNcEI7QUFDRiw0QkFBNEI7QUFDckIsSUFBTSxRQUFRLEdBQUcsVUFBQyxJQUFtQjtJQUMxQyxPQUFBLElBQUEsT0FBRSxFQUFDLGdCQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQztBQUEvQyxDQUErQyxDQUFDO0FBRHJDLFFBQUEsUUFBUSxZQUM2QiJ9