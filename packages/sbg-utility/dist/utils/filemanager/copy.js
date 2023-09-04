"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyPath = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
/**
 * copy file/folder recursively
 * @param src
 * @param dest
 * @param options
 * @returns
 */
function copyPath(src, dest, options) {
    if (!fs_extra_1.default.existsSync(path_1.default.dirname(dest))) {
        fs_extra_1.default.mkdirSync(path_1.default.dirname(dest), { recursive: true });
    }
    return fs_extra_1.default.copy(src, dest, Object.assign({ overwrite: true, dereference: true, errorOnExist: false }, options || {}));
}
exports.copyPath = copyPath;
//# sourceMappingURL=copy.js.map