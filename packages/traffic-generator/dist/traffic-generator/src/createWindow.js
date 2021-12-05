"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
//import PROXIES from "./proxies";
const webview_proxy_1 = __importDefault(require("./proxies/webview-proxy"));
//import windowProxy from "./proxies/window-proxy";
const electron_1 = require("electron");
const webworker = __importStar(require("./electron-utils/webworker"));
const proxies = __importStar(require("./proxies"));
const createWindow = () => {
    let win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        center: true,
        frame: false,
        title: "Traffic Automator <dimaslanjaka@gmail.com>",
        webPreferences: {
            preload: path_1.default.join(__dirname, "scripts/preload.js"),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            spellcheck: true,
            webviewTag: true,
            webSecurity: false,
            partition: "persist:webviewsession" // OR  'persist:unique_random_path' to save session on disk
        }
    });
    function loadDefault() {
        win.loadURL("file://" + __dirname + "/views/index.html");
    }
    //loadDefault();
    function injectWebViewProxy(proxy, url) {
        (0, webview_proxy_1.default)(proxy, "persist:webviewsession", (details) => {
            // delete dead proxy
            proxies.remove(proxy);
            proxy = proxies.random();
            // send notification to renderer
            console.log("sending notification");
            webworker.sendToRenderer(win, "toastr", {
                title: "Proxy Change",
                message: `${proxy} ${details.url}`
            });
            // rotate proxies
            injectWebViewProxy(proxy, details.url);
        });
        // reload current url
        if (url) {
            console.log("current", url);
            win.loadURL(url);
        }
        else {
            loadDefault();
        }
    }
    injectWebViewProxy(proxies.random());
    /*const proxyClass = new PROXIES(win);
    let proxy = proxyClass.getRandom();
  
    function injectWindowProxy() {
      windowProxy(win, proxy);
      proxyClass.deleteProxy(proxy);
      proxy = proxyClass.getRandom();
    }*/
    win.webContents.on("will-navigate", (e, redirectUrl) => {
        // send notification
        webworker.sendToRenderer(win, "toastr", {
            message: `will-navigate ${redirectUrl}`
        });
    });
    win.once("ready-to-show", () => {
        win.show();
        win.minimize();
    });
    win.on("closed", function () {
        win = null;
    });
    win.on("app-command", (e, cmd) => {
        // Navigate the window back when the user hits their mouse back button
        if (cmd === "browser-backward" && win.webContents.canGoBack()) {
            win.webContents.goBack();
        }
    });
    return win;
};
exports.default = createWindow;
//# sourceMappingURL=createWindow.js.map