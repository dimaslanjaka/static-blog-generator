"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcodeNow = exports.now = void 0;
var _config_1 = __importDefault(require("../types/_config"));
function now() {
    return (new Date()
        .toLocaleString('en-US', {
        timeZone: _config_1.default.timezone
    })
        .replace(/T/, ' ')
        .replace(/\..+/, ''));
}
exports.now = now;
function shortcodeNow(file, read) {
    var rex = /<!-- now\(\) -->/gm;
    var matchRegex = read.match(rex);
    if (matchRegex && matchRegex.length > 0) {
        read = read.replace(rex, function () { return now(); });
    }
    return read;
}
exports.shortcodeNow = shortcodeNow;
exports.default = shortcodeNow;
