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
const constant_1 = require("./db/constant");
const db_1 = __importDefault(require("./db"));
const cache_1 = require("./utils/cache");
const proxies_1 = require("./proxies");
const ipm = electron_1.ipcMain;
// load config
const config = JSON.parse((0, fm_1.readFile)(path_1.default.join(process.cwd(), "config.json")).toString());
// database folder
const dbf = path_1.default.join(process.cwd(), "databases");
// database class
const db = new db_1.default(dbf);
const proxies = db.get(constant_1.DB_PROXIES_KEY, []);
// load proxy
const proxy = proxyFile_1.default.fromText(proxies.join("\n"));
const win = [];
const theme = new theme_1.default(path_1.default.join(__dirname, "views/routes"));
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(async () => {
    //app.allowRendererProcessReuse = false;
    createNewWindow("options");
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.ipcMain.on("new-window", (e, msg) => {
    const routePath = path_1.default.basename(msg[0], ".html");
    //console.log(routePath, theme.route(routePath).getPath());
    createNewWindow(routePath);
});
// handle proxy change webview
ipm.handle("change-webview-proxy", (event, partisi, clear_cache) => {
    if (clear_cache) {
        (0, cache_1.clearCachePartition)(partisi);
    }
    const prx = proxy.random();
    return (0, proxies_1.getProxyPartition)(partisi).then((deadpx) => {
        proxy.delete(deadpx);
        (0, proxies_1.setProxyPartition)(partisi, prx);
        return prx;
    });
});
function createNewWindow(routePath = "/") {
    win[routePath] = createWindow();
    (0, global_1.shortcutInit)(win[routePath]);
    const menuBuilder = new gui_menu_1.default(win[routePath]);
    menuBuilder.buildMenu();
    const renderer = theme.route(routePath).getPath(true);
    win[routePath].loadURL(renderer);
    win[routePath].once("ready-to-show", () => {
        win[routePath].show();
        win[routePath].webContents.openDevTools();
    });
    // Emitted when the window is closed.
    win[routePath].on("closed", function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win[routePath] = null;
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