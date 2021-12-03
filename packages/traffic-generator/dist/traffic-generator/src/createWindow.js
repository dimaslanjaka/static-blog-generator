"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var proxies_1 = (0, tslib_1.__importDefault)(require("./proxies"));
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
    var proxyClass = new proxies_1.default(win);
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
            console.log("sending notification");
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
    win.webContents.on("will-navigate", function (e, redirectUrl) {
        // send notification
        webworker.sendToRenderer(win, "toastr", {
            message: "will-navigate " + redirectUrl
        });
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlV2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NyZWF0ZVdpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBd0I7QUFDeEIsbUVBQWdDO0FBQ2hDLHVGQUFtRDtBQUNuRCxxRkFBaUQ7QUFDakQscUNBQXlDO0FBQ3pDLGlGQUF3RDtBQUV4RCxJQUFNLFlBQVksR0FBRztJQUNuQixJQUFJLEdBQUcsR0FBRyxJQUFJLHdCQUFhLENBQUM7UUFDMUIsS0FBSyxFQUFFLEdBQUc7UUFDVixNQUFNLEVBQUUsR0FBRztRQUNYLElBQUksRUFBRSxLQUFLO1FBQ1gsTUFBTSxFQUFFLElBQUk7UUFDWixLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSw0Q0FBNEM7UUFDbkQsY0FBYyxFQUFFO1lBQ2QsT0FBTyxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDO1lBQ25ELGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixVQUFVLEVBQUUsSUFBSTtZQUNoQixVQUFVLEVBQUUsSUFBSTtZQUNoQixXQUFXLEVBQUUsS0FBSztZQUNsQixTQUFTLEVBQUUsd0JBQXdCLENBQUMsMkRBQTJEO1NBQ2hHO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsSUFBTSxVQUFVLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUVuQyxTQUFTLGlCQUFpQjtRQUN4QixJQUFBLHNCQUFXLEVBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsS0FBSyxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsU0FBUyxXQUFXO1FBQ2xCLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxTQUFTLGtCQUFrQixDQUFDLEtBQWEsRUFBRSxHQUFZO1FBQ3JELElBQUEsdUJBQVksRUFBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUUsVUFBQyxPQUFPO1lBQ3BELG9CQUFvQjtZQUNwQixVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLEtBQUssR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDL0IsZ0NBQWdDO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNwQyxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7Z0JBQ3RDLEtBQUssRUFBRSxjQUFjO2dCQUNyQixPQUFPLEVBQUssS0FBSyxTQUFJLE9BQU8sQ0FBQyxHQUFLO2FBQ25DLENBQUMsQ0FBQztZQUNILGlCQUFpQjtZQUNqQixrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgscUJBQXFCO1FBQ3JCLElBQUksR0FBRyxFQUFFO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDNUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQjthQUFNO1lBQ0wsV0FBVyxFQUFFLENBQUM7U0FDZjtJQUNILENBQUM7SUFDRCxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUUxQixHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBQyxDQUFDLEVBQUUsV0FBVztRQUNqRCxvQkFBb0I7UUFDcEIsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO1lBQ3RDLE9BQU8sRUFBRSxtQkFBaUIsV0FBYTtTQUN4QyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ2YsR0FBRyxHQUFHLElBQUksQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBQyxDQUFDLEVBQUUsR0FBRztRQUMzQixzRUFBc0U7UUFDdEUsSUFBSSxHQUFHLEtBQUssa0JBQWtCLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUM3RCxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQzFCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGLGtCQUFlLFlBQVksQ0FBQyJ9