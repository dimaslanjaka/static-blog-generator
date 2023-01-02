"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ansi_colors_1 = tslib_1.__importDefault(require("ansi-colors"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var through2_1 = tslib_1.__importDefault(require("through2"));
var upath_1 = require("upath");
var scheduler_1 = tslib_1.__importDefault(require("../utils/scheduler"));
function gulpDebug() {
    return through2_1.default.obj(function (file, _enc, cb) {
        var dumpfile = path_1.default.join(process.cwd(), 'tmp/dump/gulp-cache.txt');
        fs_extra_1.default.appendFileSync(dumpfile, "".concat((0, upath_1.toUnix)(file.path.replace(process.cwd(), ''))));
        scheduler_1.default.add('dump gulp-debug', function () { return console.log(ansi_colors_1.default.yellowBright('gulp-debug'), dumpfile); });
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}
exports.default = gulpDebug;
