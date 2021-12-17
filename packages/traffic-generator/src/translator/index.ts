import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import contextMenu from "../context-menu/menu2";
import { shortcutInit } from "../global";

//https://translate.google.com/translate?sl=auto&tl=en&u=https%3A%2F%2Fgamewith.net%2Fgenshin-impact%2Farticle%2Fshow%2F24530

const windowOption: Electron.BrowserWindowConstructorOptions = {
  webPreferences: {
    partition: "translator",
    preload: path.join(__dirname, "preload.js")
  }
};

function createWindow(partitionName = "translator") {
  let mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      spellcheck: true,
      webviewTag: true,
      webSecurity: false
    },
    //icon: options.icon,
    show: false,
    center: true,
    frame: false
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.on("app-command", (e, cmd) => {
    // Navigate the window back when the user hits their mouse back button
    if (cmd === "browser-backward" && mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack();
    }
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
});

function doTranslate(url: string) {
  const mainWindow = createWindow();
  //const url = "https://minecraftshader.com/how-to-install-shaders-in-minecraft/";
  const loadUrl =
    "https://translate.google.com/translate?sl=en&tl=id&u=" +
    encodeURIComponent(url);
  mainWindow.loadURL(loadUrl);
  mainWindow.webContents.openDevTools({ mode: "detach" });
  shortcutInit(mainWindow);
}
