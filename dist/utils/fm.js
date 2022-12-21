"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writefile = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
function writefile(file, content, opt) {
    if (opt === void 0) { opt = {}; }
    if (!(0, fs_1.existsSync)((0, path_1.dirname)(file)))
        (0, fs_1.mkdirSync)((0, path_1.dirname)(file), Object.assign({ recursive: true }, opt));
    if (opt.append) {
        return (0, fs_1.appendFileSync)(file, content);
    }
    (0, fs_1.writeFileSync)(file, content);
}
exports.writefile = writefile;
