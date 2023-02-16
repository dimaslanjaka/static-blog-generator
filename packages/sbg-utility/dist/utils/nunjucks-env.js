"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envNunjucks = void 0;
var hexo_util_1 = require("hexo-util");
var nunjucks_1 = __importDefault(require("nunjucks"));
function envNunjucks() {
    var env = new nunjucks_1.default.Environment();
    env.addFilter('uriencode', function (str) {
        return (0, hexo_util_1.encodeURL)(str);
    });
    env.addFilter('noControlChars', function (str) {
        return str.replace(/[\x00-\x1F\x7F]/g, ''); // eslint-disable-line no-control-regex
    });
    // Extract date from datetime
    env.addFilter('formatDate', function (input) {
        return input.toISOString().substring(0, 10);
    });
    return env;
}
exports.envNunjucks = envNunjucks;
exports.default = envNunjucks;
//# sourceMappingURL=nunjucks-env.js.map