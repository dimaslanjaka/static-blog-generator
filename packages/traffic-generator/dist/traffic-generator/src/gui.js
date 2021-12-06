"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// GUI Options
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const proxyFile_1 = __importDefault(require("./proxies/proxyFile"));
const fm_1 = require("../../hexo-seo/src/fm");
const gui_menu_1 = __importDefault(require("./gui.menu"));
const global_1 = require("./global");
const theme_1 = __importDefault(require("./views/theme"));
// load config
const config = JSON.parse((0, fm_1.readFile)(path_1.default.join(process.cwd(), "config.json")).toString());
// load proxy
const proxy = new proxyFile_1.default(path_1.default.join(process.cwd(), config.proxy));
//let win: BrowserWindow;
const theme = new theme_1.default(path_1.default.join(__dirname, "views/routes"));
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(async () => {
    //app.allowRendererProcessReuse = false;
    createNewWindow("options");
});
function createNewWindow(routePath) {
    const win = createWindow();
    (0, global_1.shortcutInit)(win);
    const menuBuilder = new gui_menu_1.default(win);
    menuBuilder.buildMenu();
    const renderer = theme.route(routePath).getPath(true);
    win.loadURL(renderer);
    win.once("ready-to-show", () => {
        win.show();
        win.webContents.openDevTools();
    });
    electron_1.ipcMain.on("new-window", (e, ...msg) => {
        console.log(msg[0]);
    });
    return win;
}
function createWindow() {
    return new electron_1.BrowserWindow({
        frame: false,
        width: 1000,
        height: 600,
        center: true,
        show: false,
        title: "Dynamic Traffic Automator <dimaslanjaka@gmail.com>",
        webPreferences: {
            preload: path_1.default.join(__dirname, "scripts/preload.js"),
            partition: "persist:webviewsession",
            webviewTag: true,
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false // open node
        }
    });
}
//# sourceMappingURL=gui.js.map