"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dynamic webview full control from renderer
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const proxyFile_1 = __importDefault(require("./proxies/proxyFile"));
const fm_1 = require("../../hexo-seo/src/fm");
const proxies_1 = require("./proxies");
const global_1 = require("./global");
// load config
const config = JSON.parse((0, fm_1.readFile)(path_1.default.join(process.cwd(), "config.json")).toString());
// load proxy
const proxy = new proxyFile_1.default(path_1.default.join(process.cwd(), config.proxy));
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({
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
    return win;
}
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(async () => {
    createWindow();
    await (0, proxies_1.setProxyWindow)(win, proxy.random());
    win.loadURL("https://www.webmanajemen.com/page/bot-detect");
    //win.loadURL("https://www.google.com/search?q=what+is+my+ip");
    win.once("ready-to-show", (e, top) => {
        win.show();
        //win.webContents.openDevTools({ mode: "bottom" });
    });
    const reloadProxy = async () => {
        const prx = await (0, proxies_1.getProxyWindow)(win);
        proxy.delete(prx[0]);
        await (0, proxies_1.setProxyWindow)(win, proxy.random());
        win.reload();
    };
    win.webContents.on("did-fail-load", async function (event, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId) {
        reloadProxy();
    });
    win.webContents.on("did-finish-load", async function () {
        const title = win.webContents.getTitle().trim();
        if (title.toLowerCase().startsWith("attention required!")) {
            win.setTitle("proxy blocked by cloudflare");
            return reloadProxy();
        }
        const prx = await (0, proxies_1.getProxyWindow)(win);
        win.setTitle(title.substring(0, 150) + ` ${prx}`);
    });
    // set shortcut
    (0, global_1.shortcutInit)(win);
});
//# sourceMappingURL=window-proxy.js.map