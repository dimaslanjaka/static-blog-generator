import { app, BrowserWindow, Menu, MenuItem, IpcMain } from "electron";
import { lte } from "lodash";
import path from "path";
import contextMenu from "../../electron-browser/src/main/menu";
import SOCKS5 from "./proxies/socks5";

const createWindow = () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    show: false,
    title: "Traffic Automator <dimaslanjaka@gmail.com>",
    webPreferences: {
      preload: path.join(__dirname, "scripts/preload.js"),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.once("ready-to-show", () => {
    win.show();
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
        win.loadURL("https://whatismyipaddress.com/");
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

  loadURLP(proxy);

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
    console.log("title", title);
  });

  win.webContents.on("did-finish-load", function () {
    const title = win.getTitle();
    if (title.toLowerCase().startsWith("attention required!")) {
      restartProxy();
    }
    console.log(win.getTitle());
  });

  /* Set did-fail-load listener once, load default view */
  win.webContents.on(
    "did-fail-load",
    function (event, errorCode, errorDescription) {
      //console.log("did-fail-load", errorCode);

      restartProxy();
      win.loadURL("file://" + __dirname + "/views/index.html");
    }
  );
};

contextMenu();

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
