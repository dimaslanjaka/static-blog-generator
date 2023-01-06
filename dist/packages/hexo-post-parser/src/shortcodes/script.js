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
exports.shortcodeScript = void 0;
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var upath_1 = require("upath");
var _config_1 = require("../types/_config");
var root = (0, upath_1.toUnix)(process.cwd());
var logname = chalk_1.default.blue('[script]');
function shortcodeScript(file, str) {
    var log = [logname];
    var regex = /<!--\s+?script\s+?(.+?)\s+?-->/gim;
    var execs = Array.from(str.matchAll(regex));
    execs.forEach(function (m) {
        var htmlTag = m[0];
        var includefile = m[1];
        var dirs = {
            directFile: (0, upath_1.join)((0, upath_1.dirname)(file.toString()), includefile),
            rootFile: (0, upath_1.join)(root, includefile)
        };
        var _loop_1 = function (key) {
            if (Object.prototype.hasOwnProperty.call(dirs, key)) {
                var filepath = dirs[key];
                if ((0, fs_1.existsSync)(filepath)) {
                    log[0] += chalk_1.default.greenBright("[".concat(key, "]"));
                    if (_config_1.verbose)
                        console.log.apply(console, __spreadArray(__spreadArray([], __read(log), false), [file], false));
                    var read_1 = (0, fs_1.readFileSync)(filepath, 'utf-8');
                    str = str.replace(htmlTag, function () { return "<script>".concat(read_1, "</script>"); });
                    return "break";
                }
            }
        };
        for (var key in dirs) {
            var state_1 = _loop_1(key);
            if (state_1 === "break")
                break;
        }
    });
    return str;
}
exports.shortcodeScript = shortcodeScript;
