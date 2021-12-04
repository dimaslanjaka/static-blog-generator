"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var webview_proxy_1 = require("./proxies/webview-proxy");
var proxies = (0, tslib_1.__importStar)(require("./proxies"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vidmlldy1tdWx0aXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWJ2aWV3LW11bHRpcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUF1RTtBQUN2RSwyREFBd0I7QUFDeEIseURBQWdEO0FBQ2hELDhEQUFxQztBQUNyQyxJQUFJLEdBQWtCLENBQUM7QUFFdkIsU0FBUyxZQUFZO0lBQ25CLEdBQUcsR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDdEIsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLElBQUk7U0FDakI7S0FDRixDQUFDLENBQUM7SUFFSCxTQUFTLGtCQUFrQjtRQUN6QixJQUFNLFFBQVEsR0FBRyxDQUFDLHdCQUF3QixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVM7WUFDekIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzdCLElBQU0sR0FBRyxHQUFHLGtCQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBYSxTQUFTLHNCQUFpQixLQUFPLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUMsQ0FBQztZQUNILEdBQUcsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQUMsT0FBTztnQkFDckMsSUFDRSxPQUFPLENBQUMsWUFBWSxJQUFJLFdBQVc7b0JBQ25DLENBQUMsSUFBQSxxQkFBSyxFQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFDckM7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