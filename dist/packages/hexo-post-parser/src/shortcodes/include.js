"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShortCodeInclude = void 0;
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = require("fs");
var upath_1 = require("upath");
var _config_1 = require("../types/_config");
var root = (0, upath_1.toUnix)(process.cwd());
var logname = chalk_1.default.blue('[include]');
function parseShortCodeInclude(sourceFile, bodyString) {
    var regex = /<!--\s+?include\s+?(.+?)\s+?-->/gim;
    var modified = false;
    var execs = Array.from(bodyString.matchAll(regex));
    while (execs.length > 0) {
        for (var i = 0; i < execs.length; i++) {
            var match = execs.shift();
            var htmlTag = match[0];
            var includefile = match[1];
            var dirs = {
                directFile: (0, upath_1.join)((0, upath_1.dirname)(sourceFile.toString()), includefile),
                rootFile: (0, upath_1.join)(root, includefile)
            };
            dirs.assetFolder = (0, upath_1.join)(sourceFile.replace(/.md$/, ''), includefile);
            var _loop_1 = function (key) {
                if (Object.prototype.hasOwnProperty.call(dirs, key)) {
                    var filepath = dirs[key];
                    if ((0, fs_1.existsSync)(filepath)) {
                        if (_config_1.verbose) {
                            console.log(logname + chalk_1.default.greenBright("[".concat(key, "]")), sourceFile);
                        }
                        var read_1 = (0, fs_1.readFileSync)(filepath).toString();
                        bodyString = bodyString.replace(htmlTag, function () { return read_1; });
                        execs = Array.from(bodyString.matchAll(regex));
                        modified = true;
                        return "break";
                    }
                }
            };
            for (var key in dirs) {
                var state_1 = _loop_1(key);
                if (state_1 === "break")
                    break;
            }
        }
    }
    if (regex.test(bodyString) && modified) {
        return parseShortCodeInclude(sourceFile, bodyString);
    }
    return bodyString;
}
exports.parseShortCodeInclude = parseShortCodeInclude;
exports.default = parseShortCodeInclude;
