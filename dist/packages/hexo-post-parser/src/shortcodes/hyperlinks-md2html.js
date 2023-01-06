"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceMD2HTML = void 0;
var color_1 = __importDefault(require("../node/color"));
var _config_1 = require("../types/_config");
var regex = /\[([^\]]+)\]\(([^)]+(.md))\)/gim;
var logname = color_1.default['Blizzard Blue']('[replaceMD2HTML]');
function replaceMD2HTML(content) {
    if (content.match(regex)) {
        content = content.replace(regex, function (wholeMatch, _index1, index2, index3) {
            var toReplace = index2;
            var replacement = index2.replace(new RegExp(index3 + '$'), '.html');
            if (_config_1.verbose)
                console.log(logname, color_1.default.redBright(toReplace), '->', color_1.default.greenBright(replacement));
            return wholeMatch.replace(toReplace, replacement);
        });
    }
    return content;
}
exports.replaceMD2HTML = replaceMD2HTML;
exports.default = replaceMD2HTML;
