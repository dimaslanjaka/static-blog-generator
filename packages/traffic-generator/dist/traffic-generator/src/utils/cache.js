"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCachePartition = exports.clearCache = void 0;
const electron_1 = require("electron");
const cleanCache = (ses) => {
    ses.clearCache();
    ses.clearStorageData();
    ses.clearAuthCache();
    ses.clearHostResolverCache();
};
/**
 * Clear Cache Of Browser Window
 * @param win
 */
function clearCache(win) {
    const ses = win.webContents.session;
    cleanCache(ses);
}
exports.clearCache = clearCache;
function clearCachePartition(name) {
    const ses = electron_1.session.fromPartition(name);
    cleanCache(ses);
}
exports.clearCachePartition = clearCachePartition;
//# sourceMappingURL=cache.js.map