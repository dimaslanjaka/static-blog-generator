"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hexo_util_1 = require("hexo-util");
var nunjucks_1 = tslib_1.__importDefault(require("nunjucks"));
function envNunjucks() {
    var env = new nunjucks_1.default.Environment();
    env.addFilter('uriencode', function (str) {
        return (0, hexo_util_1.encodeURL)(str);
    });
    env.addFilter('noControlChars', function (str) {
        return str.replace(/[\x00-\x1F\x7F]/g, '');
    });
    env.addFilter('formatDate', function (input) {
        return input.toISOString().substring(0, 10);
    });
    return env;
}
exports.default = envNunjucks;
