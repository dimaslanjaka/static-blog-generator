"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var electron_1 = require("electron");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var fm_1 = require("../../hexo-seo/src/fm");
var node_html_parser_1 = (0, tslib_1.__importDefault)(require("node-html-parser"));
var win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1000,
        height: 600,
        center: true,
        show: false,
        title: "Dynamic Traffic Automator <dimaslanjaka@gmail.com>",
        webPreferences: {
            partition: "persist:webviewsession",
            webviewTag: true,
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    return win;
}
// load config
var config = JSON.parse((0, fm_1.readFile)(path_1.default.join(process.cwd(), "config.json")).toString());
// load proxy
var proxy = (0, fm_1.readFile)(path_1.default.join(process.cwd(), config.proxy))
    .toString()
    .split("\n");
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(function () {
    createWindow();
    var fileIndex = path_1.default.join(__dirname, "/views/dynamic-webview.html");
    var read = (0, fm_1.readFile)(fileIndex).toString();
    var parse = (0, node_html_parser_1.default)(read);
    // webviews containers
    var webviews = parse.querySelector("#webviews");
    var i = 0;
    var mwebview = [];
    for (var _i = 0, _a = Object.entries(config.webview); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        i += 1;
        var wconfig = config[key];
        var swebview = (0, fm_1.readFile)(path_1.default.join(__dirname, "/views/webview.html"))
            .toString()
            .replace("%n%", i.toString())
            .replace("%url%", key);
        var div = "<div class=\"col-md-6 d-flex pb-3\"><div class=\"card card-block\">\n          " + swebview + "\n      </div></div>";
        mwebview.push(div);
    }
    webviews.set_content(mwebview.join(""));
    (0, fm_1.writeFile)(fileIndex, parse.toString());
    win.loadURL("file://" + fileIndex);
    win.on("ready-to-show", function () {
        //win.webContents.openDevTools({ mode: "detach" });
        if (mwebview.length > 0) {
            win.show();
        }
    });
    // set shortcut
    electron_1.globalShortcut.register("f5", function () {
        console.log("reload by f5");
        win.reload();
    });
    electron_1.globalShortcut.register("CommandOrControl+R", function () {
        console.log("reload by CommandOrControl+R");
        win.reload();
    });
    win.on("closed", function () {
        win = null;
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy13ZWJ2aWV3LW11bHRpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2R5bmFtaWMtd2Vidmlldy1tdWx0aS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBdUU7QUFDdkUsMkRBQXdCO0FBSXhCLDRDQUE0RDtBQUM1RCxtRkFBMEM7QUFDMUMsSUFBSSxHQUFrQixDQUFDO0FBRXZCLFNBQVMsWUFBWTtJQUNuQixHQUFHLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQ3RCLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLEdBQUc7UUFDWCxNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxLQUFLO1FBQ1gsS0FBSyxFQUFFLG9EQUFvRDtRQUMzRCxjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUUsd0JBQXdCO1lBQ25DLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsZUFBZSxFQUFFLElBQUk7WUFDckIsZ0JBQWdCLEVBQUUsS0FBSztTQUN4QjtLQUNGLENBQUMsQ0FBQztJQUNILE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQXFCRCxjQUFjO0FBQ2QsSUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FDL0IsSUFBQSxhQUFRLEVBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FDN0QsQ0FBQztBQUVGLGFBQWE7QUFDYixJQUFNLEtBQUssR0FBYSxJQUFBLGFBQVEsRUFBQyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckUsUUFBUSxFQUFFO0tBQ1YsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWYsY0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0FBQzFFLGNBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQztBQUMxRSxjQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ25CLFlBQVksRUFBRSxDQUFDO0lBRWYsSUFBTSxTQUFTLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztJQUN0RSxJQUFNLElBQUksR0FBRyxJQUFBLGFBQVEsRUFBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM1QyxJQUFNLEtBQUssR0FBRyxJQUFBLDBCQUFVLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0Isc0JBQXNCO0lBQ3RCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDbEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsSUFBTSxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBQzlCLEtBQTJCLFVBQThCLEVBQTlCLEtBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQTlCLGNBQThCLEVBQTlCLElBQThCLEVBQUU7UUFBaEQsSUFBQSxXQUFZLEVBQVgsR0FBRyxRQUFBLEVBQUUsS0FBSyxRQUFBO1FBQ3BCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDUCxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsSUFBTSxRQUFRLEdBQUcsSUFBQSxhQUFRLEVBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsQ0FBQzthQUNuRSxRQUFRLEVBQUU7YUFDVixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUM1QixPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLG9GQUNKLFFBQVEseUJBQ0QsQ0FBQztRQUNoQixRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEMsSUFBQSxjQUFTLEVBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBRW5DLEdBQUcsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFO1FBQ3RCLG1EQUFtRDtRQUNuRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNaO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxlQUFlO0lBQ2YseUJBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDSCx5QkFBYyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDNUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2YsQ0FBQyxDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtRQUNmLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztJQUVILGNBQUcsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUU7UUFDMUIsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUNqQyxjQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDWjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsY0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7UUFDakIsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1lBQ2hCLFlBQVksRUFBRSxDQUFDO1NBQ2hCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9