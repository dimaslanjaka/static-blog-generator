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
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const webview_proxy_1 = require("./proxies/webview-proxy");
const proxies = __importStar(require("./proxies"));
const useragent_1 = require("./utils/useragent");
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1000,
        height: 600,
        title: "Multiple Webview <dimaslanjaka@gmail.com>",
        webPreferences: {
            partition: "persist:multi1",
            webviewTag: true
        }
    });
    /**
     * Inject webview proxy
     * @param clearCache Clear cookies, data, and caches on proxy change
     */
    function injectWebViewProxy(clearCache = false) {
        const persists = ["persist:webviewsession", "persist:multi1"];
        persists.forEach((partition) => {
            let proxy = proxies.random();
            const ses = electron_1.session.fromPartition(partition);
            ses.setProxy({ proxyRules: proxy }).then(() => {
                console.log(`injected [${partition}] with proxy: ${proxy}`);
            });
            ses.setUserAgent((0, useragent_1.random)());
            const sessionReloadProxy = (removePreviousProxy = false) => {
                if (removePreviousProxy)
                    proxies.remove(proxy);
                // regenerate proxy
                proxy = proxies.random();
                // reset proxy
                ses.setProxy({ proxyRules: proxy }).then(() => {
                    console.log(`re-injected [${partition}] with proxy: ${proxy}`);
                });
                if (clearCache) {
                    // flush caches and data
                    ses.clearCache();
                    ses.clearStorageData();
                    ses.clearAuthCache();
                    ses.clearHostResolverCache();
                    // flush cookies
                    ses.cookies.flushStore().then(() => {
                        // reload window after reset proxy
                        win.reload();
                    });
                }
                else {
                    // reload window after reset proxy
                    win.reload();
                }
            };
            ses.webRequest.onErrorOccurred((details) => {
                if (details.resourceType == "mainFrame" &&
                    !(0, webview_proxy_1.isAds)(new URL(details.url).hostname)) {
                    const errors = [
                        "ERR_TIMED_OUT",
                        "ERR_PROXY_CONNECTION_FAILED",
                        "ERR_TUNNEL_CONNECTION_FAILED"
                    ];
                    // check if the string has some of the terms
                    const hasProxyError = errors.some((term) => details.error.toUpperCase().includes(term));
                    if (hasProxyError) {
                        sessionReloadProxy(true);
                    }
                    console.log(hasProxyError ? "proxy error" : "request error", details.error, details.url);
                } /*else if (details.resourceType == "subFrame") {
                  //console.log("error loading url", details.url, details.resourceType);
                  if (
                    /googlesyndication|googleads\.g\.doubleclick\.net/g.test(
                      details.url
                    )
                  ) {
                    sessionReloadProxy();
                  }
                }*/
            });
        });
        // reload multi webview
        win.loadURL("file://" + __dirname + "/views/webview-multi.html");
    }
    injectWebViewProxy();
    win.on("closed", () => {
        win = null;
    });
    electron_1.globalShortcut.register("f5", function () {
        console.log("reload by f5");
        win.reload();
    });
    electron_1.globalShortcut.register("CommandOrControl+R", function () {
        console.log("reload by CommandOrControl+R");
        win.reload();
    });
}
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            electron_1.app.quit();
        }
    });
    electron_1.app.on("activate", () => {
        if (win === null) {
            createWindow();
        }
    });
});
//# sourceMappingURL=webview-multiple.js.map