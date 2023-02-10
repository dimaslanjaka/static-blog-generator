"use strict";
// filemanager
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMarkdown = exports.isAsset = exports.createWriteStream = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var upath_1 = __importDefault(require("upath"));
__exportStar(require("./del"), exports);
__exportStar(require("./emptyDir"), exports);
__exportStar(require("./getAppRootDir"), exports);
__exportStar(require("./images"), exports);
__exportStar(require("./normalizePath"), exports);
__exportStar(require("./readDir"), exports);
__exportStar(require("./writefile"), exports);
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