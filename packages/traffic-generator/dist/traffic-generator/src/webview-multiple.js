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
                    var errors = ["ERR_TIMED_OUT", "ERR_PROXY_CONNECTION_FAILED"];
                    // check if the string has some of the terms
                    var hasProxyError = errors.some(function (term) {
                        return details.error.toUpperCase().includes(term);
                    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vidmlldy1tdWx0aXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWJ2aWV3LW11bHRpcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUF1RDtBQUN2RCwyREFBd0I7QUFDeEIseURBQWdEO0FBQ2hELDhEQUFxQztBQUNyQyxJQUFJLEdBQWtCLENBQUM7QUFFdkIsU0FBUyxZQUFZO0lBQ25CLEdBQUcsR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDdEIsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsR0FBRztRQUNYLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRSxnQkFBZ0I7WUFDM0IsVUFBVSxFQUFFLElBQUk7U0FDakI7S0FDRixDQUFDLENBQUM7SUFFSCxTQUFTLGtCQUFrQjtRQUN6QixJQUFNLFFBQVEsR0FBRyxDQUFDLHdCQUF3QixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVM7WUFDekIsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQy9CLElBQU0sR0FBRyxHQUFHLGtCQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBYSxTQUFTLHNCQUFpQixLQUFPLENBQUMsQ0FBQztZQUM5RCxDQUFDLENBQUMsQ0FBQztZQUNILEdBQUcsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQUMsT0FBTztnQkFDckMsSUFDRSxPQUFPLENBQUMsWUFBWSxJQUFJLFdBQVc7b0JBQ25DLENBQUMsSUFBQSxxQkFBSyxFQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFDckM7b0JBQ0EsSUFBTSxNQUFNLEdBQUcsQ0FBQyxlQUFlLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztvQkFDaEUsNENBQTRDO29CQUM1QyxJQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSTt3QkFDckMsT0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQTFDLENBQTBDLENBQzNDLENBQUM7b0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FDVCxhQUFhLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUMvQyxPQUFPLENBQUMsS0FBSyxFQUNiLE9BQU8sQ0FBQyxHQUFHLENBQ1osQ0FBQztpQkFDSDtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCx1QkFBdUI7UUFDdkIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLDJCQUEyQixDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNELGtCQUFrQixFQUFFLENBQUM7SUFFckIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7UUFDZixHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ2IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsY0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0FBQzFFLGNBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQztBQUMxRSxjQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ25CLFlBQVksRUFBRSxDQUFDO0lBRWYsY0FBRyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtRQUMxQixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1lBQ2pDLGNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNaO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxjQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRTtRQUNqQixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDaEIsWUFBWSxFQUFFLENBQUM7U0FDaEI7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=