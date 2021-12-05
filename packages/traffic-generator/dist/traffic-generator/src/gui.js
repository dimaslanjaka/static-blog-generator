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
// load config
const config = JSON.parse((0, fm_1.readFile)(path_1.default.join(process.cwd(), "config.json")).toString());
// load proxy
const proxy = new proxyFile_1.default(path_1.default.join(process.cwd(), config.proxy));
let win;
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(async () => {
    win = createWindow();
    (0, global_1.shortcutInit)(win);
    const menuBuilder = new gui_menu_1.default(win);
    menuBuilder.buildMenu();
    win.loadURL("file://" + __dirname + "/views/theme/index.html");
    win.once("ready-to-show", () => {
        win.show();
    });
});
function createWindow() {
    return new electron_1.BrowserWindow({
        //frame: false, // hide dock
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