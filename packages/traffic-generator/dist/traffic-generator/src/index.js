"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var menu_1 = (0, tslib_1.__importDefault)(require("../../electron-browser/src/main/menu"));
var socks5_1 = (0, tslib_1.__importDefault)(require("./proxies/socks5"));
var createWindow = function () {
    var win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        show: false,
        title: "Traffic Automator <dimaslanjaka@gmail.com>",
        webPreferences: {
            preload: path_1.default.join(__dirname, "scripts/preload.js"),
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.once("ready-to-show", function () {
        win.show();
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
            win.loadURL("https://whatismyipaddress.com/");
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
    loadURLP(proxy);
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
        console.log("title", title);
    });
    win.webContents.on("did-finish-load", function () {
        var title = win.getTitle();
        if (title.toLowerCase().startsWith("attention required!")) {
            restartProxy();
        }
        console.log(win.getTitle());
    });
    /* Set did-fail-load listener once, load default view */
    win.webContents.on("did-fail-load", function (event, errorCode, errorDescription) {
        //console.log("did-fail-load", errorCode);
        restartProxy();
        win.loadURL("file://" + __dirname + "/views/index.html");
    });
};
(0, menu_1.default)();
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXVFO0FBRXZFLDJEQUF3QjtBQUN4QiwyRkFBK0Q7QUFDL0QseUVBQXNDO0FBRXRDLElBQU0sWUFBWSxHQUFHO0lBQ25CLElBQUksR0FBRyxHQUFHLElBQUksd0JBQWEsQ0FBQztRQUMxQixLQUFLLEVBQUUsR0FBRztRQUNWLE1BQU0sRUFBRSxHQUFHO1FBQ1gsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsS0FBSztRQUNYLEtBQUssRUFBRSw0Q0FBNEM7UUFDbkQsY0FBYyxFQUFFO1lBQ2QsT0FBTyxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDO1lBQ25ELGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGdCQUFnQixFQUFFLEtBQUs7U0FDeEI7S0FDRixDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtRQUN4QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztJQUVIOzs7T0FHRztJQUNILFNBQVMsUUFBUSxDQUFDLEdBQVcsRUFBRSxRQUFxQjtRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNoQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU87YUFDcEIsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDO2FBQzdCLElBQUksQ0FBQztZQUNKLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsVUFBQyxHQUFHLElBQU0sQ0FBQyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQU0sVUFBVSxHQUFHLElBQUksZ0JBQU0sRUFBRSxDQUFDO0lBQ2hDLElB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