"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWriteStream = exports.writefile = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
function writefile(file, content, opt) {
    if (opt === void 0) { opt = {}; }
    if (!fs_extra_1.default.existsSync(path_1.default.dirname(file)))
        fs_extra_1.default.mkdirSync(path_1.default.dirname(file), Object.assign({ recursive: true }, opt));
    var result = {
        file: file,
        append: false
    };
    if (opt.append) {
        result.append = true;
        fs_extra_1.default.appendFileSync(file, content);
    }
    else {
        fs_extra_1.default.writeFileSync(file, content);
    }
    if (opt.async)
        return Promise.resolve(result);
    return result;
}
exports.writefile = writefile;
function createWriteStream(dest, options) {
    if (!fs_extra_1.default.existsSync(path_1.default.dirname(dest)))
        fs_extra_1.default.mkdirSync(path_1.default.dirname(dest));
    return fs_extra_1.default.createWriteStream(dest, options);
}
exports.createWriteStream = createWriteStream;
