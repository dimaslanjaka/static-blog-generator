"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
dotenv_1.default.config();
var electron_1 = require("electron");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var menu2_1 = (0, tslib_1.__importDefault)(require("./context-menu/menu2"));
var createWindow_1 = (0, tslib_1.__importDefault)(require("./createWindow"));
//import cookieManager from "./electron-utils/cookies";
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(function () {
    var mainWindow = (0, createWindow_1.default)();
    //cookieManager(mainWindow);
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
            mainWindow = (0, createWindow_1.default)();
        }
    });
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0RBQTRCO0FBQzVCLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEIscUNBQThEO0FBQzlELDJEQUF3QjtBQUN4Qiw0RUFBK0M7QUFDL0MsNkVBQTBDO0FBRTFDLHVEQUF1RDtBQUV2RCxjQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7QUFDMUUsY0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0FBQzFFLGNBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDbkIsSUFBSSxVQUFVLEdBQTJCLElBQUEsc0JBQVksR0FBRSxDQUFDO0lBQ3hELDRCQUE0QjtJQUM1Qiw2QkFBNkI7SUFDN0IsSUFBQSxlQUFXLEVBQUMsY0FBRyxDQUFDLENBQUM7SUFDakIseUJBQWMsQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEVBQUU7UUFDaEQsaURBQWlEO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0gseUJBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQzVCLCtCQUErQjtRQUMvQixVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDSCx5QkFBYyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtRQUM1QywrQ0FBK0M7UUFDL0MsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0gseUJBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO1FBQzdCLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtZQUMzQyxVQUFVLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDOztZQUNwQyxVQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUgsY0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7UUFDakIsSUFBTSxZQUFZLEdBQUcsd0JBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDM0MsMEJBQTBCO1FBQzFCLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtZQUN0QixJQUFJLFVBQVUsQ0FBQyxRQUFRO2dCQUFFLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM1QyxVQUFVLEdBQUcsSUFBQSxzQkFBWSxHQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsY0FBRyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtJQUMxQixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUTtRQUFFLGNBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoRCxDQUFDLENBQUMsQ0FBQyJ9