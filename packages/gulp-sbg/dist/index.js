"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUntrackedSitemap = exports.commitProject = exports.watchPost = exports.copyPost = exports.copySinglePost = exports.copyAllPosts = void 0;
require("./gulpfile");
var scheduler_1 = __importDefault(require("./utils/scheduler"));
var gulp_post_1 = require("./gulp.post");
Object.defineProperty(exports, "copyAllPosts", { enumerable: true, get: function () { return gulp_post_1.copyAllPosts; } });
Object.defineProperty(exports, "copySinglePost", { enumerable: true, get: function () { return gulp_post_1.copySinglePost; } });
Object.defineProperty(exports, "copyPost", { enumerable: true, get: function () { return gulp_post_1.updatePost; } });
Object.defineProperty(exports, "watchPost", { enumerable: true, get: function () { return gulp_post_1.watchPost; } });
var gulpfile_1 = require("./gulpfile");
Object.defineProperty(exports, "commitProject", { enumerable: true, get: function () { return gulpfile_1.commitProject; } });
Object.defineProperty(exports, "getUntrackedSitemap", { enumerable: true, get: function () { return gulpfile_1.getUntrackedSitemap; } });
scheduler_1.default.register();
