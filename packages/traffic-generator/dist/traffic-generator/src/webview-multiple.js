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
    function injectWebViewProxy() {
        var persists = ["persist:webviewsession", "persist:multi1"];
        persists.forEach(function (partition) {
            var proxy = proxies.random();
            var ses = electron_1.session.fromPartition(partition);
            ses.setProxy({ proxyRules: proxy }).then(function () {
                console.log("injected [" + partition + "] with proxy: " + proxy);
            });
            ses.setUserAgent((0, useragent_1.random)());
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
                        proxies.remove(proxy);
                        // regenerate proxy
                        proxy = proxies.random();
                        // reset proxy
                        ses.setProxy({ proxyRules: proxy }).then(function () {
                            console.log("re-injected [" + partition + "] with proxy: " + proxy);
                        });
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
                    console.log(hasProxyError ? "proxy error" : "request error", details.error, details.url);
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vidmlldy1tdWx0aXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWJ2aWV3LW11bHRpcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUF1RTtBQUN2RSwyREFBd0I7QUFDeEIseURBQWdEO0FBQ2hELDhEQUFxQztBQUNyQywrQ0FBc0Q7QUFDdEQsSUFBSSxHQUFrQixDQUFDO0FBRXZCLFNBQVMsWUFBWTtJQUNuQixHQUFHLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQ3RCLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLEdBQUc7UUFDWCxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUUsZ0JBQWdCO1lBQzNCLFVBQVUsRUFBRSxJQUFJO1NBQ2pCO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsU0FBUyxrQkFBa0I7UUFDekIsSUFBTSxRQUFRLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlELFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTO1lBQ3pCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM3QixJQUFNLEdBQUcsR0FBRyxrQkFBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWEsU0FBUyxzQkFBaUIsS0FBTyxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUEsa0JBQU8sR0FBRSxDQUFDLENBQUM7WUFDNUIsR0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBQyxPQUFPO2dCQUNyQyxJQUNFLE9BQU8sQ0FBQyxZQUFZLElBQUksV0FBVztvQkFDbkMsQ0FBQyxJQUFBLHFC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