"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHtmlPath = exports.getAssetPath = exports.RESOURCES_PATH = void 0;
// Electron Filemanager
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
/**
 * Define resources path
 */
exports.RESOURCES_PATH = electron_1.app.isPackaged
    ? path_1.default.join(process.resourcesPath, "assets")
    : path_1.default.join(__dirname, "../../assets");
/**
 * get resources path based on {@link RESOURCES_PATH}
 * @param paths
 * @returns
 */
const getAssetPath = (...paths) => {
    return path_1.default.join(exports.RESOURCES_PATH, ...paths);
};
exports.getAssetPath = getAssetPath;
if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 1212;
    exports.resolveHtmlPath = (htmlFileName) => {
        const url = new URL(`http://localhost:${port}`);
        url.pathname = htmlFileName;
        return url.href;
    };
}
else {
    exports.resolveHtmlPath = (htmlFileName) => {
        return `file://${path_1.default.resolve(__dirname, "../views/theme/", htmlFileName)}`;
    };
}
//# sourceMappingURL=filemanager.js.map