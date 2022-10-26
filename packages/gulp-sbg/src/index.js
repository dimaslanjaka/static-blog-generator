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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getUntrackedSitemap = exports.commitProject = exports.watchPost = exports.copySinglePost = exports.copyPost = exports.copyAllPosts = void 0;
require("./gulpfile");
var scheduler_1 = __importDefault(require("./utils/scheduler"));
var gulp_post_1 = require("./gulp.post");
__createBinding(exports, gulp_post_1, "copyAllPosts");
__createBinding(exports, gulp_post_1, "copyPost");
__createBinding(exports, gulp_post_1, "copySinglePost");
__createBinding(exports, gulp_post_1, "watchPost");
var gulpfile_1 = require("./gulpfile");
__createBinding(exports, gulpfile_1, "commitProject");
__createBinding(exports, gulpfile_1, "getUntrackedSitemap");
scheduler_1["default"].register();
