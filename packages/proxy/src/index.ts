import { app, globalShortcut, ipcMain } from "electron";
import createWindow from "./window";
import contextMenu from "./menu";
import process from "process";
import { kill } from "./kill";
import path from "path";
import getHtml from "./getHtml";
import * as fs from "fs";

let mainWindow: Electron.BrowserWindow;
// initialize context menu
contextMenu();
// bind process killer
kill.bind(app);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

(async () => {
  await app.whenReady();
  app.setName("Electron Browser");
  app.setPath("userData", path.join(app.getPath("appData"), app.getName()));
  app.setPath("userCache", path.join(app.getPath("cache"), app.getName()));
  //Menu.setApplicationMenu(menu);
  app
    .whenReady()
    .then(() => {
      globalShortcut.register("Alt+CommandOrControl+L", () => {
        mainWindow.webContents.send("show-server-log");
      });
      globalShortcut.register("f5", function () {
        console.log("f5 is pressed");
        mainWindow.reload();
      });
      globalShortcut.register("CommandOrControl+R", function () {
        console.log("CommandOrControl+R is pressed");
        mainWindow.reload();
      });
    })
    .then(() => {
      mainWindow = createWindow();
      mainWindow.maximize();
      getHtml(mainWindow, function (html) {
        fs.writeFileSync(path.join(__dirname, "/../build/generatedHTML/index.html"), html);
      });
    });
})();
