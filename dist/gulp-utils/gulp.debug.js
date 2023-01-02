"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ansi_colors_1 = tslib_1.__importDefault(require("ansi-colors"));
var path_1 = tslib_1.__importDefault(require("path"));
var through2_1 = tslib_1.__importDefault(require("through2"));
var upath_1 = require("upath");
var fm_1 = require("../utils/fm");
var scheduler_1 = tslib_1.__importDefault(require("../utils/scheduler"));
function gulpDebug() {
    return through2_1.default.obj(function (file, _enc, cb) {
        var dumpfile = path_1.default.join(process.cwd(), 'tmp/dump/gulp-cache.txt');
        (0, fm_1.writefile)(dumpfile, "".concat((0, upath_1.toUnix)(file.path.replace(process.cwd(), ''))), { append: true });
        scheduler_1.default.add('dump gulp-debug', function () { return console.log(ansi_colors_1.default.yellowBright('gulp-debug'), dumpfile); });
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}
exports.default = gulpDebug;
