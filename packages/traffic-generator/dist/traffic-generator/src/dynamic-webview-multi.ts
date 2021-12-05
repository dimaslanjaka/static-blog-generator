import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  MenuItem,
  session
} from "electron";
import path from "path";
import { isAds } from "./proxies/webview-proxy";
import * as proxies from "./proxies";
import { random as rand_ua } from "./utils/useragent";
import proxyFile from "./proxies/proxyFile";
import { readFile, writeFile } from "../../hexo-seo/src/fm";
import htmlParser from "node-html-parser";
import { Config, shortcutInit } from "./global";
let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    frame: false, // hide dock
    width: 1000,
    height: 600,
    center: true,
    show: false, // hide first initialize
    title: "Dynamic Traffic Automator <dimaslanjaka@gmail.com>",
    webPreferences: {
      preload: path.join(__dirname, "scripts/preload.js"),
      partition: "persist:webviewsession",
      webviewTag: true,
      webSecurity: false,
      enableRemoteModule: true, // open remote
      nodeIntegration: true, // open node
      contextIsolation: false // open node
    }
  });
  return win;
}

// load config
const config: Config = JSON.parse(
  readFile(path.join(process.cwd(), "config.json")).toString()
);

// load proxy
const proxy = new proxyFile(path.join(process.cwd(), config.proxy));

app.setPath("userData", path.join(process.cwd(), "build/electron/cache"));
app.setPath("userCache", path.join(process.cwd(), "build/electron/data"));
app.whenReady().then(() => {
  createWindow();

  const loadWebview = () => {
    const fileIndex = path.join(__dirname, "/views/dynamic-webview.html");
    const read = readFile(fileIndex).toString();
    const parse = htmlParser(read);
    // webviews containers
    const webviews = parse.querySelector("#webviews");
    let i = 0;
    const mwebview = {};
    const partitions: string[] = [];
    for (const [url, value] of Object.entries(config.webview)) {
      // initialize variable
      i += 1;
      const persist = "persist:multi" + i;
      partitions.push(persist);
      const wconfig = Object.assign({}, value);

      // prepare session
      const ses = session.fromPartition(persist);
      if (wconfig.clean) {
        ses.clearAuthCache();
        ses.clearCache();
        ses.clearHostResolverCache();
        ses.clearStorageData();
        ses.cookies.flushStore();
      }

      ses.on("will-download", function (e) {
        e.preventDefault();
      });

      // generate proxy
      let singleproxy: string = proxy.random();

      if (wconfig.proxy) {
        // reset proxy
        ses.setProxy({ proxyRules: "http://" + singleproxy }).then(() => {
          console.log(`[${persist}] : ${singleproxy}`);
        });
      }

      // session error handler
      ses.webRequest.onErrorOccurred((details) => {
        if (
          details.resourceType == "mainFrame" &&
          !isAds(new URL(details.url).hostname)
        ) {
          // ignore manual cancel
          const manualCancel = ["ERR_ABORTED"].some((term) =>
            details.error.toUpperCase().includes(term)
          );
          if (manualCancel) return;

          // check if the string has some of the terms
          const hasProxyError = [
            "ERR_TIMED_OUT",
            "ERR_PROXY_CONNECTION_FAILED",
            "ERR_TUNNEL_CONNECTION_FAILED"
          ].some((term) => details.error.toUpperCase().includes(term));

          if (hasProxyError) {
            if (wconfig.proxy) {
              ses.resolveProxy("http://google.com").then((px) => {
                proxy.delete(px);
                //console.log("dead proxy", px);
              });
              // regenerate proxy
              singleproxy = proxy.random();
              // reset proxy
              ses.setProxy({ proxyRules: "http://" + singleproxy }).then(() => {
                console.log(`reset [${persist}] : ${singleproxy}`);
              });
              // uncomment to handle errors serverside
              // return win.reload();
            }
          }

          win.webContents.send("session-error", {
            error: hasProxyError ? "proxy" : "webpage",
            url: details.url,
            message: details.error
          });

          console.log(
            hasProxyError ? "proxy error" : "request error",
            details.error,
            details.url
          );
        } /*else if (details.resourceType == "subFrame") {
          //console.log("error loading url", details.url, details.resourceType);
          if (
            /googlesyndication|googleads\.g\.doubleclick\.net/g.test(
              details.url
            )
          ) {
            sessionReloadProxy();
          }
        }*/
      });

      // prepare webview
      const swebview = readFile(path.join(__dirname, "/views/webview.html"))
        .toString()
        .replace(/%n%/g, i.toString())
        .replace("%url%", url)
        .replace("%id%", persist.replace(/[\W_]+/g, ""));
      const div = `<div data-id="webview" data-partition="${persist}" class="col-md-6 d-flex pb-3"><div class="card card-block">
    <h3 class="card-title"><span data-id="partition">${persist}</span> <span data-id="proxy">${singleproxy}</span></h3>
    ${swebview}
    </div></div>`;
      mwebview[persist] = div;
    }
    webviews.set_content(Object.values(mwebview).join(""));
    writeFile(fileIndex, parse.toString());
    win.loadURL("file://" + fileIndex);
  };

  loadWebview();

  ipcMain.on("reload", (e, msg) => {
    console.log("reload by ipcMain");
    win.reload();
  });

  // handle proxy change webview
  ipcMain.handle("change-webview-proxy", (event, partisi) => {
    const prx = proxy.random();
    const ses = session.fromPartition(partisi);
    ses.resolveProxy("http://google.com").then((deadpx) => {
      proxy.delete(deadpx);
    });
    ses.setProxy({ proxyRules: "http://" + prx });
    return prx;
  });

  win.once("ready-to-show", function () {
    win.show();
    win.webContents.openDevTools({ mode: "bottom" });
    //win.minimize();
  });

  // handle new tab link open
  win.webContents.setWindowOpenHandler((details) => {
    const url = details.url;
    console.log("window need open", url);
    /*if (url === "about:blank") {
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          frame: false,
          fullscreenable: false,
          backgroundColor: "black",
          webPreferences: {
            //preload: "my-child-window-preload-script.js"
            webviewTag: true,
            partition: "persist:webviewsession"
          }
        }
      };
    }*/
    return { action: "deny" };
  });

  // set shortcut
  shortcutInit(win);

  win.on("closed", () => {
    win = null;
  });

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
