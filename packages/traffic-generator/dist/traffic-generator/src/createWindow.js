"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var socks5_1 = (0, tslib_1.__importDefault)(require("./proxies/socks5"));
var https_1 = (0, tslib_1.__importDefault)(require("./proxies/https"));
var webview_proxy_1 = (0, tslib_1.__importDefault)(require("./proxies/webview-proxy"));
var window_proxy_1 = (0, tslib_1.__importDefault)(require("./proxies/window-proxy"));
var electron_1 = require("electron");
var webworker = (0, tslib_1.__importStar)(require("./electron-utils/webworker"));
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
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
    var proxyClasses = [new https_1.default(win), new socks5_1.default(win)];
    var proxyClass = proxyClasses[0];
    var proxy = proxyClass.getRandom();
    function injectWindowProxy() {
        (0, window_proxy_1.default)(win, proxy);
        proxyClass.deleteProxy(proxy);
        proxy = proxyClass.getRandom();
    }
    function loadDefault() {
        win.loadURL("file://" + __dirname + "/views/index.html");
    }
    function injectWebViewProxy(proxy, url) {
        (0, webview_proxy_1.default)(proxy, "persist:webviewsession", function (details) {
            // delete dead proxy
            proxyClass.deleteProxy(proxy);
            proxy = proxyClass.getRandom();
            // send notification to renderer
            webworker.sendToRenderer(win, "toastr", {
                title: "Proxy Change",
                message: proxy + " " + details.url
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
    injectWebViewProxy(proxy);
    win.once("ready-to-show", function () {
        win.show();
        win.minimize();
    });
    win.on("closed", function () {
        win = null;
    });
    win.on("app-command", function (e, cmd) {
        // Navigate the window back when the user hits their mouse back button
        if (cmd === "browser-backward" && win.webContents.canGoBack()) {
            win.webContents.goBack();
        }
    });
    return win;
};
exports.default = createWindow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlV2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NyZWF0ZVdpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBd0I7QUFDeEIseUVBQXNDO0FBQ3RDLHVFQUFvQztBQUNwQyx1RkFBbUQ7QUFDbkQscUZBQWlEO0FBQ2pELHFDQUF5QztBQUN6QyxpRkFBd0Q7QUFFeEQsSUFBTSxZQUFZLEdBQUc7SUFDbkIsSUFBSSxHQUFHLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQzFCLEtBQUssRUFBRSxHQUFHO1FBQ1YsTUFBTSxFQUFFLEdBQUc7UUFDWCxJQUFJLEVBQUUsS0FBSztRQUNYLE1BQU0sRUFBRSxJQUFJO1FBQ1osS0FBSyxFQUFFLEtBQUs7UUFDWixLQUFLLEVBQUUsNENBQTRDO1FBQ25ELGNBQWMsRUFBRTtZQUNkLE9BQU8sRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQztZQUNuRCxlQUFlLEVBQUUsSUFBSTtZQUNyQixrQkFBa0IsRUFBRSxJQUFJO1lBQ3hCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsVUFBVSxFQUFFLElBQUk7WUFDaEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsU0FBUyxFQUFFLHdCQUF3QixDQUFDLDJEQUEyRDtTQUNoRztLQUNGLENBQUMsQ0FBQztJQUVILElBQU0sWUFBWSxHQUFHLENBQUMsSUFBSSxlQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkQsSUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUVuQyxTQUFTLGlCQUFpQjtRQUN4QixJQUFBLHNCQUFXLEVBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsU0FBUyxXQUFXO1FBQ2xCLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxTQUFTLGtCQUFrQixDQUFDLEtBQWEsRUFBRSxHQUFZO1FBQ3JELElBQUEsdUJBQVksRUFBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUUsVUFBQyxPQUFPO1lBQ3BELG9CQUFvQjtZQUNwQixVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLEtBQUssR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDL0IsZ0NBQWdDO1lBQ2hDLFNBQVMsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtnQkFDdEMsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLE9BQU8sRUFBSyxLQUFLLFNBQUksT0FBTyxDQUFDLEdBQUs7YUFDbkMsQ0FBQyxDQUFDO1lBQ0gsaUJBQWlCO1lBQ2pCLGtCQUFrQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFDSCxxQkFBcUI7UUFDckIsSUFBSSxHQUFHLEVBQUU7WUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM1QixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO2FBQU07WUFDTCxXQUFXLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUNELGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTFCLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ2YsR0FBRyxHQUFHLElBQUksQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBQyxDQUFDLEVBQUUsR0FBRztRQUMzQixzRUFBc0U7UUFDdEUsSUFBSSxHQUFHLEtBQUssa0JBQWtCLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUM3RCxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQzFCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGLGtCQUFlLFlBQVksQ0FBQyJ9