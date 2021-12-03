import path from "path";
import PROXIES from "./proxies";
import webviewProxy from "./proxies/webview-proxy";
import windowProxy from "./proxies/window-proxy";
import { BrowserWindow } from "electron";
import * as webworker from "./electron-utils/webworker";

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

  const proxyClass = new PROXIES(win);
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
      proxy = proxyClass.getRandom();
      // send notification to renderer
      console.log("sending notification");
      webworker.sendToRenderer(win, "toastr", {
        title: "Proxy Change",
        message: `${proxy} ${details.url}`
      });
      // rotate proxies
      injectWebViewProxy(proxy, details.url);
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

  win.webContents.on("will-navigate", (e, redirectUrl) => {
    // send notification
    webworker.sendToRenderer(win, "toastr", {
      message: `will-navigate ${redirectUrl}`
    });
  });

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

export default createWindow;
