"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanDb = void 0;
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var hexo_1 = __importDefault(require("hexo"));
var path_1 = require("path");
var gulp_config_1 = __importDefault(require("./gulp.config"));
function cleanDb() {
    return new Promise(function (resolve) {
        var config = gulp_config_1.default;
        var post = (0, path_1.join)(process.cwd(), config.source_dir, '_posts');
        var publicDir = (0, path_1.join)(process.cwd(), config.public_dir);
        var tmpDir = (0, path_1.join)(process.cwd(), 'tmp');
        if ((0, fs_1.existsSync)(tmpDir))
            (0, fs_1.rmdirSync)(tmpDir, { recursive: true });
        if ((0, fs_1.existsSync)(post))
            (0, fs_1.rmdirSync)(post, { recursive: true });
        if ((0, fs_1.existsSync)(publicDir))
            (0, fs_1.rmdirSync)(publicDir, { recursive: true });
        var hexo = new hexo_1.default(process.cwd());
        hexo.init().then(function () {
            hexo.call('clean').then(function () {
                resolve(null);
            });
        });
    });
}
exports.cleanDb = cleanDb;
gulp_1.default.task('clean', cleanDb);
