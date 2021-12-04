import { app, BrowserWindow, globalShortcut } from "electron";
import path from "path";
import webviewProxy from "./proxies/webview-proxy";
import * as proxies from "./proxies";
let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      partition: "persist:multi1",
      webviewTag: true
    }
  });

  function injectWebViewProxy(url?: string) {
    const proxy = proxies.random();
    const persists = ["persist:webviewsession", "persist:multi1"];
    persists.forEach((persist) => {
      webviewProxy(proxy, persist, (details) => {
        // delete dead proxy
        // proxies.remove(proxy);
        // proxy = proxies.random();
        // rotate proxies
        injectWebViewProxy(details.url);
      });
    });

    // reload multi webview
    win.loadURL("file://" + __dirname + "/views/webview-multi.html");
  }
  injectWebViewProxy();

  win.on("closed", () => {
    win = null;
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
    if (win === null) {
      createWindow();
    }
  });
});
