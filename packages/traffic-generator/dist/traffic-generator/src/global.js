"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcutInit = void 0;
const electron_1 = require("electron");
/**
 * Shortcut initializer (automated find active window)
 * @see {@link https://stackoverflow.com/a/64502431}
 * @param win
 */
function shortcutInit(win) {
    win.on("focus", () => {
        electron_1.globalShortcut.register("f5", function () {
            console.log("reload by f5");
            win.reload();
        });
        electron_1.globalShortcut.register("ESC", function () {
            if (win.closable)
                win.close();
        });
        electron_1.globalShortcut.register("CommandOrControl+R", function () {
            console.log("reload by CommandOrControl+R");
            win.reload();
        });
    });
    win.on("blur", () => {
        electron_1.globalShortcut.unregisterAll();
    });
}
exports.shortcutInit = shortcutInit;
//# sourceMappingURL=global.js.map