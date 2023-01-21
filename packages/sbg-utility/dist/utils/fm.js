"use strict";
// filemanager
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.isMarkdown = exports.isAsset = exports.createWriteStream = exports.writefile = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var upath_1 = __importDefault(require("upath"));
/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
function writefile(file, content, opt) {
    if (opt === void 0) { opt = {}; }
    // create dirname when not exist
    if (!fs_extra_1.default.existsSync(upath_1.default.dirname(file)))
        fs_extra_1.default.mkdirSync(upath_1.default.dirname(file), Object.assign({ recursive: true }, opt));
    var result = {
        file: file,
        append: false
    };
    // transform object
    if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2);
    }
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
/**
 * create writestream (auto create dirname)
 * @param dest
 * @param options
 * @returns
 */
function createWriteStream(dest, options) {
    if (!fs_extra_1.default.existsSync(upath_1.default.dirname(dest)))
        fs_extra_1.default.mkdirSync(upath_1.default.dirname(dest));
    return fs_extra_1.default.createWriteStream(dest, options);
}
exports.createWriteStream = createWriteStream;
/**
 * is non-markdown file
 * @param path
 * @returns
 */
var isAsset = function (path) { return /.(js|css|scss|njk|ejs|png|jpe?g|gif|svg|webp|json|html|txt)$/.test(String(path)); };
exports.isAsset = isAsset;
/**
 * is markdown file
 * @param path
 * @returns
 */
var isMarkdown = function (path) { return /.(md)$/i.test(String(path)); };
exports.isMarkdown = isMarkdown;
/**
 * delete folder async
 * @param path
 * @returns
 */
function del(path) {
    return new bluebird_1.default(function (resolve) {
        var rmOpt = { recursive: true, force: true };
        if (fs_extra_1.default.existsSync(path)) {
            fs_extra_1.default.rm(path, rmOpt).then(resolve).catch(resolve);
            /*if (statSync(path).isDirectory()) {
              rmdir(path, { maxRetries: 10 }).then(resolve).catch(resolve);
            } else {
              rm(path, rmOpt).then(resolve).catch(resolve);
            }*/
        }
        else {
            resolve(new Error(path + ' not found'));
        }
    });
}
exports.del = del;
//# sourceMappingURL=fm.js.map