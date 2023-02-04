"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpLog = exports.gulpDebug = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var os_1 = require("os");
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
var filemanager_1 = require("../utils/filemanager");
var hash_1 = require("../utils/hash");
var logger_1 = __importDefault(require("../utils/logger"));
var scheduler_1 = __importDefault(require("../utils/scheduler"));
function gulpDebug(filename) {
    var _a;
    var caller = (0, hash_1.data_to_hash_sync)('md5', ((_a = new Error('get caller').stack) === null || _a === void 0 ? void 0 : _a.split(/\r?\n/gim).filter(function (str) { return /(dist|src)/i.test(str); })[1]) || '').slice(0, 5);
    var pid = process.pid;
    var logname = 'gulp-' + ansi_colors_1.default.gray('debug');
    return through2_1.default.obj(function (file, _enc, cb) {
        // Logger.log(ansiColors.yellowBright('gulp-debug'), process.pid, toUnix(file.path.replace(process.cwd(), '')));
        // dump
        var dumpfile = (0, upath_1.join)(process.cwd(), 'tmp/dump/gulp-debug', filename || "".concat(caller, "-").concat(pid, ".log"));
        (0, filemanager_1.writefile)(dumpfile, "".concat((0, upath_1.toUnix)(file.path.replace(process.cwd(), ''))) + os_1.EOL, {
            append: true
        });
        scheduler_1.default.add("".concat(logname, " dump ").concat(ansi_colors_1.default.cyan(caller), " pid ").concat(ansi_colors_1.default.yellow(String(pid))), function () {
            return console.log(logname, dumpfile);
        });
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}
exports.gulpDebug = gulpDebug;
/**
 * log all files
 * @returns
 */
function gulpLog(logname) {
    if (logname === void 0) { logname = ''; }
    return through2_1.default.obj(function (file, _enc, cb) {
        logger_1.default.log(ansi_colors_1.default.yellowBright('gulp-log'), logname, (0, upath_1.toUnix)(file.path.replace(process.cwd(), '')), String(file.contents).length);
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}
exports.gulpLog = gulpLog;
exports.default = gulpDebug;
//# sourceMappingURL=gulp.debug.js.map