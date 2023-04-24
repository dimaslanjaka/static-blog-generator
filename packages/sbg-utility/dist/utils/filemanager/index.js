"use strict";
// filemanager
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMarkdown = exports.isAsset = exports.createWriteStream = exports.pathJoin = exports.joinPath = void 0;
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var upath_1 = tslib_1.__importDefault(require("upath"));
tslib_1.__exportStar(require("./del"), exports);
tslib_1.__exportStar(require("./emptyDir"), exports);
tslib_1.__exportStar(require("./getAppRootDir"), exports);
tslib_1.__exportStar(require("./images"), exports);
tslib_1.__exportStar(require("./normalizePath"), exports);
var normalizePath_1 = require("./normalizePath");
Object.defineProperty(exports, "joinPath", { enumerable: true, get: function () { return normalizePath_1.normalizePath; } });
Object.defineProperty(exports, "pathJoin", { enumerable: true, get: function () { return normalizePath_1.normalizePath; } });
tslib_1.__exportStar(require("./readDir"), exports);
tslib_1.__exportStar(require("./writefile"), exports);
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
//# sourceMappingURL=index.js.map