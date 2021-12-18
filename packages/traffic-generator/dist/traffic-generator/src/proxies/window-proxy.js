"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Electron Browser Window Proxy
 * @param win
 * @param proxy ex "socks5://88.198.50.103:1080"
 */
function windowProxy(win, proxy, callback) {
    win.webContents.session
        .setProxy({ proxyRules: proxy })
        .then(() => {
        win.loadURL("https://www.webmanajemen.com/page/bot-detect");
    })
        .catch((err) => { });
    /* Set did-fail-load listener once, load default view */
    win.webContents.on("did-fail-load", function (event, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId) {
        if (typeof callback == "function" && isMainFrame) {
            callback(proxy, errorCode, errorDescription, validatedURL, isMainFrame);
        }
    });
    win.webContents.on("did-finish-load", function () {
        const title = win.getTitle();
        if (title.toLowerCase().startsWith("attention required!")) {
            if (typeof callback === "function") {
                callback(proxy, null, "Proxy blocked by cloudflare", win.webContents.getURL(), null);
            }
        }
        //console.log(win.getTitle());
    });
}
exports.default = windowProxy;
//# sourceMappingURL=window-proxy.js.map