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
            contextIsolation: false,
        },
    });
    win.once("ready-to-show", function () {
        win.show();
        win.minimize();
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
// inject custom context menu
(0, menu_1.default)();
electron_1.app.whenReady().then(function () {
    var mainWindow; // = createWindow();
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
        console.log("total", totalWindows);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQThEO0FBQzlELDJEQUF3QjtBQUN4QiwyRkFBK0Q7QUFDL0QseUVBQXNDO0FBRXRDLElBQU0sWUFBWSxHQUFHO0lBQ25CLElBQUksR0FBRyxHQUFHLElBQUksd0JBQWEsQ0FBQztRQUMxQixLQUFLLEVBQUUsR0FBRztRQUNWLE1BQU0sRUFBRSxHQUFHO1FBQ1gsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsS0FBSztRQUNYLEtBQUssRUFBRSw0Q0FBNEM7UUFDbkQsY0FBYyxFQUFFO1lBQ2QsT0FBTyxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDO1lBQ25ELGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGdCQUFnQixFQUFFLEtBQUs7U0FDeEI7S0FDRixDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtRQUN4QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7SUFFSDs7O09BR0c7SUFDSCxTQUFTLFFBQVEsQ0FBQyxHQUFXLEVBQUUsUUFBcUI7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPO2FBQ3BCLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQzthQUM3QixJQUFJLENBQUM7WUFDSixHQUFHLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLFVBQUMsR0FBRyxJQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFNLFVBQVUsR0FB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