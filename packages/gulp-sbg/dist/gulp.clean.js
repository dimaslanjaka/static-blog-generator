"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanDb = void 0;
const fs_1 = require("fs");
const gulp_1 = __importDefault(require("gulp"));
const hexo_1 = __importDefault(require("hexo"));
const path_1 = require("path");
const gulp_config_1 = __importDefault(require("./gulp.config"));
function cleanDb() {
    return new Promise((resolve) => {
        const config = gulp_config_1.default;
        const post = (0, path_1.join)(process.cwd(), config.source_dir, '_posts');
        const publicDir = (0, path_1.join)(process.cwd(), config.public_dir);
        if ((0, fs_1.existsSync)(post))
            (0, fs_1.rmdirSync)(post, { recursive: true });
        if ((0, fs_1.existsSync)(publicDir))
            (0, fs_1.rmdirSync)(publicDir, { recursive: true });
        const hexo = new hexo_1.default(process.cwd());
        hexo.call('clean').then(() => {
            resolve(null);
        });
    });
}
exports.cleanDb = cleanDb;
gulp_1.default.task('clean', cleanDb);
