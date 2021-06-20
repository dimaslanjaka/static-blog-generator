import { app, globalShortcut } from "electron";
import createWindow from "./window";
import contextMenu from "./menu";
import process from "process";
import { kill } from "./kill";

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
    });
})();
