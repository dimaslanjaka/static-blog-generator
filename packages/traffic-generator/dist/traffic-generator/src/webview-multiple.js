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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vidmlldy1tdWx0aXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWJ2aWV3LW11bHRpcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUF1RTtBQUN2RSwyREFBd0I7QUFDeEIseURBQWdEO0FBQ2hELDhEQUFxQztBQUNyQywrQ0FBc0Q7QUFDdEQsSUFBSSxHQUFrQixDQUFDO0FBRXZCLFNBQVMsWUFBWTtJQUNuQixHQUFHLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQ3RCLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLEdBQUc7UUFDWCxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxJQUFJO1NBQ2pCO0tBQ0YsQ0FBQyxDQUFDO0lBRUg7OztPQUdHO0lBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxVQUFrQjtRQUFsQiwyQkFBQSxFQUFBLGtCQUFrQjtRQUM1QyxJQUFNLFFBQVEsR0FBRyxDQUFDLHdCQUF3QixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVM7WUFDekIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzdCLElBQU0sR0FBRyxHQUFHLGtCQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBYSxTQUFTLHNCQUFpQixLQUFPLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUMsQ0FBQztZQUNILEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBQSxrQkFBTyxHQUFFLENBQUMsQ0FBQztZQUM1QixJQUFNLGtCQUFrQixHQUFHLFVBQUMsbUJBQTJCO2dCQUEzQixvQ0FBQSxFQUFBLDJC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