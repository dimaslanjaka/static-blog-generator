"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var slugify_1 = __importDefault(require("slugify"));
var upath_1 = require("upath");
var FOLDER = (0, upath_1.join)(process.cwd(), 'tmp/logs/gulp-sbg');
/**
 * @example
 * const console = Logger
 * console.log('hello world'); // should be written in ./tmp/logs/gulp-sbg/[trace-name].log
 */
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([], __read(args), false));
        this.tracer.apply(this, __spreadArray([], __read(args), false));
    };
    Logger.tracer = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var error = new Error();
        var split = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split(/\r?\n/gm).map(function (str) {
            var _a;
            var split2 = str.trim().split(' ');
            return {
                name: split2[1],
                path: (_a = split2[2]) === null || _a === void 0 ? void 0 : _a.replace(/\\+/gm, '/').replace(/^\(/, '').replace(/\)$/, '')
                //trace: error.stack
            };
        });
        if (split) {
            split.splice(0, 3);
            var logfile = void 0;
            var templ_1;
            // anonymous caller
            if (typeof split[0].path === 'undefined' && split[1].path.includes('anonymous')) {
                var id = split[1].name;
                var path = split[0].name;
                var base = (0, upath_1.basename)(path.split(':')[0].length === 1 ? path.split(':')[0] + ':' + path.split(':')[1] : path.split(':')[0]);
                logfile = (0, upath_1.join)(FOLDER, (0, slugify_1.default)(id, { trim: true }) + '-' + (0, slugify_1.default)(base, { trim: true }) + '.log');
                if (!(0, fs_extra_1.existsSync)(logfile)) {
                    (0, fs_extra_1.mkdirpSync)((0, upath_1.dirname)(logfile));
                    (0, fs_extra_1.writeFileSync)(logfile, '');
                }
                templ_1 = "".concat('='.repeat(20), "\nfile: ").concat(path, "\ndate: ").concat(new Date(), "\n").concat('='.repeat(20), "\n\n");
                args.forEach(function (o) {
                    if (o === null)
                        o = 'null';
                    if (typeof o === 'object') {
                        try {
                            o = JSON.stringify(o, null, 2);
                        }
                        catch (_a) {
                            //
                        }
                    }
                    templ_1 += String(o) + '\n\n';
                });
                (0, fs_extra_1.appendFileSync)(logfile, templ_1);
            }
            // console.log(split);
        }
    };
    return Logger;
}());
exports.default = Logger;
