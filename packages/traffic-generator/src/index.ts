import dotenv from "dotenv";
dotenv.config();
import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import contextMenu from "./context-menu/menu2";
import createWindow from "./createWindow";

//import cookieManager from "./electron-utils/cookies";

app.setPath("userData", path.join(process.cwd(), "build/electron/cache"));
app.setPath("userCache", path.join(process.cwd(), "build/electron/data"));
app.whenReady().then(() => {
  let mainWindow: Electron.BrowserWindow = createWindow();
  //cookieManager(mainWindow);
  // inject custom context menu
  contextMenu(app);
  globalShortcut.register("Alt+CommandOrControl+L", () => {
    //mainWindow.webContents.send("show-server-log");
  });
  globalShortcut.register("f5", function () {
    //console.log("f5 is pressed");
    mainWindow.reload();
  });
  globalShortcut.register("CommandOrControl+R", function () {
    //console.log("CommandOrControl+R is pressed");
    mainWindow.reload();
  });
  globalShortcut.register("F12", () => {
    if (mainWindow.webContents.isDevToolsOpened())
      mainWindow.webContents.closeDevTools();
    else mainWindow.webContents.openDevTools({ mode: "undocked" });
  });

  app.on("activate", () => {
    const totalWindows = BrowserWindow.getAllWindows().length;
    console.log("total windows", totalWindows);
    // if browser window empty
    if (totalWindows === 0) {
      if (mainWindow.closable) mainWindow.close();
      mainWindow = createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
