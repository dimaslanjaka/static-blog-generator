"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
//https://translate.google.com/translate?sl=auto&tl=en&u=https%3A%2F%2Fgamewith.net%2Fgenshin-impact%2Farticle%2Fshow%2F24530
function createWindow() {
    let mainWindow = new electron_1.BrowserWindow({
        autoHideMenuBar: true,
        width: 640,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            spellcheck: true,
            webviewTag: true,
            webSecurity: false,
            preload: path_1.default.join(__dirname, "preload.js")
        },
        //icon: options.icon,
        show: false,
        center: true,
        frame: false
    });
    mainWindow.on("close", () => {
        mainWindow.webContents.send("stop-server");
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
    return mainWindow;
}
electron_1.ipcMain.on("html-content", (event, arg) => {
    console.log(arg); // prints "ping"
    event.reply("asynchronous-reply", "pong");
});
electron_1.app.whenReady().then(() => {
    const mainWindow = createWindow();
    mainWindow.loadURL("https://translate.google.com/translate?sl=auto&tl=en&u=https%3A%2F%2Fgamewith.net%2Fgenshin-impact%2Farticle%2Fshow%2F24530");
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
});
//# sourceMappingURL=index.js.map