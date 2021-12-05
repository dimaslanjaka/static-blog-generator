"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcutInit = void 0;
const electron_1 = require("electron");
function shortcutInit(win) {
    electron_1.globalShortcut.register("f5", function () {
        console.log("reload by f5");
        win.reload();
    });
    electron_1.globalShortcut.register("CommandOrControl+R", function () {
        console.log("reload by CommandOrControl+R");
        win.reload();
    });
}
exports.shortcutInit = shortcutInit;
//# sourceMappingURL=global.js.map