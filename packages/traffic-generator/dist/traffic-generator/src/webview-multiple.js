"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var webview_proxy_1 = require("./proxies/webview-proxy");
var proxies = (0, tslib_1.__importStar)(require("./proxies"));
var useragent_1 = require("./utils/useragent");
var win;
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
    function injectWebViewProxy(clearCache) {
        if (clearCache === void 0) { clearCache = false; }
        var persists = ["persist:webviewsession", "persist:multi1"];
        persists.forEach(function (partition) {
            var proxy = proxies.random();
            var ses = electron_1.session.fromPartition(partition);
            ses.setProxy({ proxyRules: proxy }).then(function () {
                console.log("injected [" + partition + "] with proxy: " + proxy);
            });
            ses.setUserAgent((0, useragent_1.random)());
            var sessionReloadProxy = function (removePreviousProxy) {
                if (removePreviousProxy === void 0) { removePreviousProxy = false; }
                if (removePreviousProxy)
                    proxies.remove(proxy);
                // regenerate proxy
                proxy = proxies.random();
                // reset proxy
                ses.setProxy({ proxyRules: proxy }).then(function () {
                    console.log("re-injected [" + partition + "] with proxy: " + proxy);
                });
                if (clearCache) {
                    // flush caches and data
                    ses.clearCache();
                    ses.clearStorageData();
                    ses.clearAuthCache();
                    ses.clearHostResolverCache();
                    // flush cookies
                    ses.cookies.flushStore().then(function () {
                        // reload window after reset proxy
                        win.reload();
                    });
                }
                else {
                    // reload window after reset proxy
                    win.reload();
                }
            };
            ses.webRequest.onErrorOccurred(function (details) {
                if (details.resourceType == "mainFrame" &&
                    !(0, webview_proxy_1.isAds)(new URL(details.url).hostname)) {
                    var errors = [
                        "ERR_TIMED_OUT",
                        "ERR_PROXY_CONNECTION_FAILED",
                        "ERR_TUNNEL_CONNECTION_FAILED"
                    ];
                    // check if the string has some of the terms
                    var hasProxyError = errors.some(function (term) {
                        return details.error.toUpperCase().includes(term);
                    });
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
    win.on("closed", function () {
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
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on("window-all-closed", function () {
        if (process.platform !== "darwin") {
            electron_1.app.quit();
        }
    });
    electron_1.app.on("activate", function () {
        if (win === null) {
            createWindow();
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vidmlldy1tdWx0aXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWJ2aWV3LW11bHRpcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUF1RTtBQUN2RSwyREFBd0I7QUFDeEIseURBQWdEO0FBQ2hELDhEQUFxQztBQUNyQywrQ0FBc0Q7QUFDdEQsSUFBSSxHQUFrQixDQUFDO0FBRXZCLFNBQVMsWUFBWTtJQUNuQixHQUFHLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQ3RCLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLEdBQUc7UUFDWCxLQUFLLEVBQUUsMkNBQTJDO1FBQ2xELGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLElBQUk7U0FDakI7S0FDRixDQUFDLENBQUM7SUFFSDs7O09BR0c7SUFDSCxTQUFTLGtCQUFrQixDQUFDLFVBQWtCO1FBQWxCLDJCQUFBLEVBQUEsa0JBQWtCO1FBQzVDLElBQU0sUUFBUSxHQUFHLENBQUMsd0JBQXdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RCxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsU0FBUztZQUN6QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDN0IsSUFBTSxHQUFHLEdBQUcsa0JBQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0MsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFhLFNBQVMsc0JBQWlCLEtBQU8sQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1lBQ0gsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFBLGtCQUFPLEdBQUUsQ0FBQyxDQUFDO1lBQzVCLElBQU0sa0JBQWtCLEdBQUcsVUFBQyxtQkFB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