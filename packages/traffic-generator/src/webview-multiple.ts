import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      partition: "persist:multi1",
      webviewTag: true
    }
  });
  mainWindow.loadURL("file://" + __dirname + "/views/webview-multi.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.setPath("userData", path.join(process.cwd(), "build/electron/cache"));
app.setPath("userCache", path.join(process.cwd(), "build/electron/data"));
app.whenReady().then(() => {
  createWindow();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
});
