import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import contextMenu from "../../electron-browser/src/main/menu";
import SOCKS5 from "./proxies/socks5";

const createWindow = () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    center: true,
    frame: false,
    title: "Traffic Automator <dimaslanjaka@gmail.com>",
    webPreferences: {
      preload: path.join(__dirname, "scripts/preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      spellcheck: true,
      webviewTag: true,
      webSecurity: false,
    },
  });

  win.once("ready-to-show", () => {
    win.show();
    win.minimize();
  });

  /**
   * load url with proxy and set session with the proxy
   * @param prx "socks5://88.198.50.103:1080"
   */
  function loadURLP(prx: string, callback?: () => void) {
    console.log("using proxy", prx);
    win.webContents.session
      .setProxy({ proxyRules: prx })
      .then(() => {
        win.loadURL("https://www.webmanajemen.com/page/bot-detect");
      })
      .catch((err) => {});
  }

  const proxyClass = new SOCKS5();
  let proxy = proxyClass.getRandom();

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

  win.on("app-command", (e, cmd) => {
    // Navigate the window back when the user hits their mouse back button
    if (cmd === "browser-backward" && win.webContents.canGoBack()) {
      win.webContents.goBack();
    }
  });

  win.on("page-title-updated", () => {
    const title = win.getTitle();
    //console.log("title", title);
  });

  win.webContents.on("did-finish-load", function () {
    const title = win.getTitle();
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
contextMenu();

app.whenReady().then(() => {
  let mainWindow: Electron.BrowserWindow = createWindow();

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
