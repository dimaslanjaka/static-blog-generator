"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var menu2_1 = (0, tslib_1.__importDefault)(require("./context-menu/menu2"));
var socks5_1 = (0, tslib_1.__importDefault)(require("./proxies/socks5"));
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
            partition: "persist:persistent_webview" // OR  'persist:unique_random_path' to save session on disk
        }
    });
    win.once("ready-to-show", function () {
        win.show();
        if (win.webContents.isDevToolsOpened())
            win.webContents.closeDevTools();
        else
            win.webContents.openDevTools({ mode: "undocked" });
        //win.minimize();
    });
    /**
     * load url with proxy and set session with the proxy
     * @param prx "socks5://88.198.50.103:1080"
     */
    function loadURLP(prx, callback) {
        console.log("using proxy", prx);
        win.webContents.session
            .setProxy({ proxyRules: prx })
            .then(function () {
            win.loadURL("https://www.webmanajemen.com/page/bot-detect");
        })
            .catch(function (err) { });
    }
    var proxyClass = new socks5_1.default();
    var proxy = proxyClass.getRandom();
    function restartProxy() {
        console.log("restarting...");
        proxyClass.deleteProxy(proxy);
        proxy = proxyClass.getRandom();
        loadURLP(proxy);
    }
    //loadURLP(proxy);
    win.loadURL("file://" + __dirname + "/views/index.html");
    win.on("closed", function () {
        win = null;
    });
    win.on("app-command", function (e, cmd) {
        // Navigate the window back when the user hits their mouse back button
        if (cmd === "browser-backward" && win.webContents.canGoBack()) {
            win.webContents.goBack();
        }
    });
    win.on("page-title-updated", function () {
        var title = win.getTitle();
        //console.log("title", title);
    });
    win.webContents.on("did-finish-load", function () {
        var title = win.getTitle();
        if (title.toLowerCase().startsWith("attention required!")) {
            //restartProxy();
        }
        //console.log(win.getTitle());
    });
    /* Set did-fail-load listener once, load default view */
    win.webContents.on("did-fail-load", function (event, errorCode, errorDescription) {
        //console.log("did-fail-load", errorCode);
        //restartProxy();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQThEO0FBQzlELDJEQUF3QjtBQUN4Qiw0RUFBK0M7QUFDL0MseUVBQXNDO0FBRXRDLElBQU0sWUFBWSxHQUFHO0lBQ25CLElBQUksR0FBRyxHQUFHLElBQUksd0JBQWEsQ0FBQztRQUMxQixLQUFLLEVBQUUsR0FBRztRQUNWLE1BQU0sRUFBRSxHQUFHO1FBQ1gsSUFBSSxFQUFFLEtBQUs7UUFDWCxNQUFNLEVBQUUsSUFBSTtRQUNaLEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLDRDQUE0QztRQUNuRCxjQUFjLEVBQUU7WUFDZCxPQUFPLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUM7WUFDbkQsZUFBZSxFQUFFLElBQUk7WUFDckIsa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQywyREFBMkQ7U0FDcEc7S0FDRixDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtRQUN4QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7WUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztZQUNuRSxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELGlCQUFpQjtJQUNuQixDQUFDLENBQUMsQ0FBQztJQUVIOzs7T0FHRztJQUNILFNBQVMsUUFBUSxDQUFDLEdBQVcsRUFBRSxRQUFx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