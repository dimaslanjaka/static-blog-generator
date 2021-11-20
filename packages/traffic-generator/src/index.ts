import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import contextMenu from "./context-menu/menu2";
import SOCKS5 from "./proxies/socks5";
import HTTPS from "./proxies/https";
import webviewProxy from "./proxies/webview-proxy";
import windowProxy from "./proxies/window-proxy";

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
      partition: "persist:webviewsession" // OR  'persist:unique_random_path' to save session on disk
    }
  });

  const proxyClasses = [new HTTPS(win), new SOCKS5(win)];
  const proxyClass = proxyClasses[0];
  let proxy = proxyClass.getRandom();

  function injectWindowProxy() {
    windowProxy(win, proxy);
    proxyClass.deleteProxy(proxy);
    proxy = proxyClass.getRandom();
  }

  function loadDefault() {
    win.loadURL("file://" + __dirname + "/views/index.html");
  }

  function injectWebViewProxy(proxy: string, url?: string) {
    webviewProxy(proxy, "persist:webviewsession", (details) => {
      // delete dead proxy
      proxyClass.deleteProxy(proxy);
      // rotate proxies
      injectWebViewProxy(proxyClass.getRandom(), details.url);
    });
    // reload current url
    if (url) {
      console.log("current", url);
      win.loadURL(url);
    } else {
      loadDefault();
    }
  }
  injectWebViewProxy(proxy);

  win.once("ready-to-show", () => {
    win.show();
    win.minimize();
  });

  win.on("closed", function () {
    win = null;
  });

  win.on("app-command", (e, cmd) => {
    // Navigate the window back when the user hits their mouse back button
    if (cmd === "browser-backward" && win.webContents.canGoBack()) {
      win.webContents.goBack();
    }
  });

  return win;
};

app.whenReady().then(() => {
  let mainWindow: Electron.BrowserWindow = createWindow();
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
