"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ansi_colors_1 = tslib_1.__importDefault(require("ansi-colors"));
var through2_1 = tslib_1.__importDefault(require("through2"));
var upath_1 = require("upath");
var logger_1 = tslib_1.__importDefault(require("../utils/logger"));
function gulpDebug() {
    return through2_1.default.obj(function (file, _enc, cb) {
        logger_1.default.log(ansi_colors_1.default.yellowBright('gulp-debug'), (0, upath_1.toUnix)(file.path.replace(process.cwd(), '')));
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}
exports.default = gulpDebug;
