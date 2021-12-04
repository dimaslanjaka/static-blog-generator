"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
//import PROXIES from "./proxies";
var webview_proxy_1 = (0, tslib_1.__importDefault)(require("./proxies/webview-proxy"));
//import windowProxy from "./proxies/window-proxy";
var electron_1 = require("electron");
var webworker = (0, tslib_1.__importStar)(require("./electron-utils/webworker"));
var proxies = (0, tslib_1.__importStar)(require("./proxies"));
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
    function loadDefault() {
        win.loadURL("file://" + __dirname + "/views/index.html");
    }
    //loadDefault();
    function injectWebViewProxy(proxy, url) {
        (0, webview_proxy_1.default)(proxy, "persist:webviewsession", function (details) {
            // delete dead proxy
            proxies.remove(proxy);
            proxy = proxies.random();
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
    injectWebViewProxy(proxies.random());
    /*const proxyClass = new PROXIES(win);
    let proxy = proxyClass.getRandom();
  
    function injectWindowProxy() {
      windowProxy(win, proxy);
      proxyClass.deleteProxy(proxy);
      proxy = proxyClass.getRandom();
    }*/
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlV2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NyZWF0ZVdpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBd0I7QUFDeEIsa0NBQWtDO0FBQ2xDLHVGQUFtRDtBQUNuRCxtREFBbUQ7QUFDbkQscUNBQXlDO0FBQ3pDLGlGQUF3RDtBQUN4RCw4REFBcUM7QUFFckMsSUFBTSxZQUFZLEdBQUc7SUFDbkIsSUFBSSxHQUFHLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQzFCLEtBQUssRUFBRSxHQUFHO1FBQ1YsTUFBTSxFQUFFLEdBQUc7UUFDWCxJQUFJLEVBQUUsS0FBSztRQUNYLE1BQU0sRUFBRSxJQUFJO1FBQ1osS0FBSyxFQUFFLEtBQUs7UUFDWixLQUFLLEVBQUUsNENBQTRDO1FBQ25ELGNBQWMsRUFBRTtZQUNkLE9BQU8sRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQztZQUNuRCxlQUFlLEVBQUUsSUFBSTtZQUNyQixrQkFBa0IsRUFBRSxJQUFJO1lBQ3hCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsVUFBVSxFQUFFLElBQUk7WUFDaEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsU0FBUyxFQUFFLHdCQUF3QixDQUFDLDJEQUEyRDtTQUNoRztLQUNGLENBQUMsQ0FBQztJQUVILFNBQVMsV0FBVztRQUNsQixHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBQ0QsZ0JBQWdCO0lBQ2hCLFNBQVMsa0JBQWtCLENBQUMsS0FBYSxFQUFFLEdBQVk7UUFDckQsSUFBQSx1QkFBWSxFQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBRSxVQUFDLE9BQU87WUFDcEQsb0JBQW9CO1lBQ3BCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN6QixnQ0FBZ0M7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3BDLFNBQVMsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtnQkFDdEMsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLE9BQU8sRUFBSyxLQUFLLFNBQUksT0FBTyxDQUFDLEdBQUs7YUFDbkMsQ0FBQyxDQUFDO1lBQ0gsaUJBQWlCO1lBQ2pCLGtCQUFrQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBcUI7UUFDckIsSUFBSSxHQUFHLEVBQUU7WUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM1QixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO2FBQU07WUFDTCxXQUFXLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUNELGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBRXJDOzs7Ozs7O09BT0c7SUFFSCxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBQyxDQUFDLEVBQUUsV0FBVztRQUNqRCxvQkFBb0I7UUFDcEIsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO1lBQ3RDLE9BQU8sRUFBRSxtQkFBaUIsV0FBYTtTQUN4QyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNYLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ2YsR0FBRyxHQUFHLElBQUksQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBQyxDQUFDLEVBQUUsR0FBRztRQUMzQixzRUFBc0U7UUFDdEUsSUFBSSxHQUFHLEtBQUssa0JBQWtCLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUM3RCxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQzFCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGLGtCQUFlLFlBQVksQ0FBQyJ9