"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const menu2_1 = __importDefault(require("../context-menu/menu2"));
const global_1 = require("../global");
//https://translate.google.com/translate?sl=auto&tl=en&u=https%3A%2F%2Fgamewith.net%2Fgenshin-impact%2Farticle%2Fshow%2F24530
const windowOption = {
    webPreferences: {
        partition: "translator",
        preload: path_1.default.join(__dirname, "preload.js")
    }
};
function createWindow(partitionName = "translator") {
    let mainWindow = new electron_1.BrowserWindow({
        autoHideMenuBar: true,
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            spellcheck: true,
            webviewTag: true,
            webSecurity: false
        },
        //icon: options.icon,
        show: false,
        center: true,
        frame: false
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
    mainWindow.on("app-command", (e, cmd) => {
        // Navigate the window back when the user hits their mouse back button
        if (cmd === "browser-backward" && mainWindow.webContents.canGoBack()) {
            mainWindow.webContents.goBack();
        }
    });
    return mainWindow;
}
// src/translator/preload.js:4
electron_1.ipcMain.on("html-content", (event, saveLocation, html) => {
    console.log(saveLocation);
});
if (process.platform === "linux") {
    electron_1.app.disableHardwareAcceleration();
}
// set context menu
(0, menu2_1.default)(electron_1.app);
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(() => {
    const mainWindow = createWindow();
});
function doTranslate(url) {
    const mainWindow = createWindow();
    //const url = "https://minecraftshader.com/how-to-install-shaders-in-minecraft/";
    const loadUrl = "https://translate.google.com/translate?sl=en&tl=id&u=" +
        encodeURIComponent(url);
    mainWindow.loadURL(loadUrl);
    mainWindow.webContents.openDevTools({ mode: "detach" });
    (0, global_1.shortcutInit)(mainWindow);
}
//# sourceMappingURL=index.js.map