"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var menu2_1 = (0, tslib_1.__importDefault)(require("./context-menu/menu2"));
var socks5_1 = (0, tslib_1.__importDefault)(require("./proxies/socks5"));
var https_1 = (0, tslib_1.__importDefault)(require("./proxies/https"));
var webview_proxy_1 = (0, tslib_1.__importDefault)(require("./proxies/webview-proxy"));
var window_proxy_1 = (0, tslib_1.__importDefault)(require("./proxies/window-proxy"));
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
            // rotate proxies
            injectWebViewProxy(proxyClass.getRandom(), details.url);
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
electron_1.app.whenReady().then(function () {
    var mainWindow = createWindow();
    // inject custom context menu
    (0, menu2_1.default)(electron_1.app);
    electron_1.globalShortcut.register("Alt+CommandOrControl+L", function () {
        //mainWindow.webContents.send("show-server-log");
    });
    electron_1.globalShortcut.register("f5", function () {
        //console.log("f5 is pressed");
        mainWindow.reload();
    });
    electron_1.globalShortcut.register("CommandOrControl+R", function () {
        //console.log("CommandOrControl+R is pressed");
        mainWindow.reload();
    });
    electron_1.globalShortcut.register("F12", function () {
        if (mainWindow.webContents.isDevToolsOpened())
            mainWindow.webContents.closeDevTools();
        else
            mainWindow.webContents.openDevTools({ mode: "undocked" });
    });
    electron_1.app.on("activate", function () {
        var totalWindows = electron_1.BrowserWindow.getAllWindows().length;
        console.log("total windows", totalWindows);
        // if browser window empty
        if (totalWindows === 0) {
            if (mainWindow.closable)
                mainWindow.close();
            mainWindow = createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQThEO0FBQzlELDJEQUF3QjtBQUN4Qiw0RUFBK0M7QUFDL0MseUVBQXNDO0FBQ3RDLHVFQUFvQztBQUNwQyx1RkFBbUQ7QUFDbkQscUZBQWlEO0FBRWpELElBQU0sWUFBWSxHQUFHO0lBQ25CLElBQUksR0FBRyxHQUFHLElBQUksd0JBQWEsQ0FBQztRQUMxQixLQUFLLEVBQUUsR0FBRztRQUNWLE1BQU0sRUFBRSxHQUFHO1FBQ1gsSUFBSSxFQUFFLEtBQUs7UUFDWCxNQUFNLEVBQUUsSUFBSTtRQUNaLEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLDRDQUE0QztRQUNuRCxjQUFjLEVBQUU7WUFDZCxPQUFPLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUM7WUFDbkQsZUFBZSxFQUFFLElBQUk7WUFDckIsa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFNBQVMsRUFBRSx3QkFBd0IsQ0FBQywyREFBMkQ7U0FDaEc7S0FDRixDQUFDLENBQUM7SUFFSCxJQUFNLFlBQVksR0FBRyxDQUFDLElBQUksZUFBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksZ0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELElBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7SUFFbkMsU0FBUyxpQkFBaUI7UUFDeEIsSUFBQSxzQkFBVyxFQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixVQUFVLENB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