"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const menu2_1 = __importDefault(require("./context-menu/menu2"));
const createWindow_1 = __importDefault(require("./createWindow"));
//import cookieManager from "./electron-utils/cookies";
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(() => {
    let mainWindow = (0, createWindow_1.default)();
    //cookieManager(mainWindow);
    // inject custom context menu
    (0, menu2_1.default)(electron_1.app);
    electron_1.globalShortcut.register("Alt+CommandOrControl+L", () => {
        //mainWindow.webContents.send("show-server-log");
    });
    electron_1.globalShortcut.register("f5", function () {
        //console.log("f5 is pressed");
        mainWindow.reload();
    });
    electron_1.globalShortcut.register("CommandOrControl+R", function () {
        //console.log("CommandOrControl+R is pressed");
        mainWindow.reload();
    });
    electron_1.globalShortcut.register("F12", () => {
        if (mainWindow.webContents.isDevToolsOpened())
            mainWindow.webContents.closeDevTools();
        else
            mainWindow.webContents.openDevTools({ mode: "undocked" });
    });
    electron_1.app.on("activate", () => {
        const totalWindows = electron_1.BrowserWindow.getAllWindows().length;
        console.log("total windows", totalWindows);
        // if browser window empty
        if (totalWindows === 0) {
            if (mainWindow.closable)
                mainWindow.close();
            mainWindow = (0, createWindow_1.default)();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
//# sourceMappingURL=index.js.map