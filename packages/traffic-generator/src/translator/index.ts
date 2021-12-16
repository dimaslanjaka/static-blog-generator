import { app, globalShortcut, BrowserWindow, ipcMain } from "electron";
import { existsSync } from "fs";
import path from "path";
import { readFile, writeFile } from "../../../hexo-seo/src/fm";
import contextMenu from "../context-menu/menu2";

//https://translate.google.com/translate?sl=auto&tl=en&u=https%3A%2F%2Fgamewith.net%2Fgenshin-impact%2Farticle%2Fshow%2F24530

function createWindow() {
  let mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 640,
    height: 480,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      spellcheck: true,
      webviewTag: true,
      webSecurity: false,
      preload: path.join(__dirname, "preload.js")
    },
    //icon: options.icon,
    show: false,
    center: true,
    frame: false
  });
  mainWindow.on("close", () => {
    mainWindow.webContents.send("stop-server");
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  return mainWindow;
}

// src/translator/preload.js:4
ipcMain.on("html-content", (event, saveLocation: string, html: string) => {
  console.log(saveLocation);
});

if (process.platform === "linux") {
  app.disableHardwareAcceleration();
}

// set context menu
contextMenu(app);
app.setPath("userData", path.join(process.cwd(), "build/electron/cache"));
app.setPath("userCache", path.join(process.cwd(), "build/electron/data"));
app.whenReady().then(() => {
  const mainWindow = createWindow();
  const url =
    "https://minecraftshader.com/how-to-install-shaders-in-minecraft/";
  const loadUrl =
    "https://translate.google.com/translate?sl=en&tl=id&u=" +
    encodeURIComponent(url);
  mainWindow.loadURL(loadUrl);
  mainWindow.webContents.openDevTools({ mode: "detach" });
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
});
