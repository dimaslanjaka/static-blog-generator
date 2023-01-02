"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var os_1 = require("os");
var through2_1 = __importDefault(require("through2"));
var upath_1 = require("upath");
var fm_1 = require("../utils/fm");
var hash_1 = require("../utils/hash");
var scheduler_1 = __importDefault(require("../utils/scheduler"));
function gulpDebug() {
    var _a;
    var caller = (0, hash_1.data_to_hash_sync)('md5', ((_a = new Error('get caller').stack) === null || _a === void 0 ? void 0 : _a.split(/\r?\n/gim).filter(function (str) { return /(dist|src)/i.test(str); })[1]) || '').slice(0, 5);
    var pid = process.pid;
    return through2_1.default.obj(function (file, _enc, cb) {
        var dumpfile = (0, upath_1.join)(process.cwd(), 'tmp/dump/gulp-debug', "".concat(caller, "-").concat(pid, ".log"));
        (0, fm_1.writefile)(dumpfile, "".concat((0, upath_1.toUnix)(file.path.replace(process.cwd(), ''))) + os_1.EOL, {
            append: true
        });
        scheduler_1.default.add("dump gulp-debug ".concat(caller, " ").concat(pid), function () {
            return console.log(ansi_colors_1.default.yellowBright('gulp-debug'), dumpfile);
        });
        if (typeof this.push === 'function')
            this.push(file);
        cb(null, file);
    });
}
exports.default = gulpDebug;
