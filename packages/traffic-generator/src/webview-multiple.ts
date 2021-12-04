import { app, BrowserWindow, globalShortcut, session } from "electron";
import path from "path";
import { isAds } from "./proxies/webview-proxy";
import * as proxies from "./proxies";
import { random as rand_ua } from "./utils/useragent";
let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    title: "Multiple Webview <dimaslanjaka@gmail.com>",
    webPreferences: {
      partition: "persist:multi1",
      webviewTag: true
    }
  });

  /**
   * Inject webview proxy
   * @param clearCache Clear cookies, data, and caches on proxy change
   */
  function injectWebViewProxy(clearCache = false) {
    const persists = ["persist:webviewsession", "persist:multi1"];
    persists.forEach((partition) => {
      let proxy = proxies.random();
      const ses = session.fromPartition(partition);
      ses.setProxy({ proxyRules: proxy }).then(() => {
        console.log(`injected [${partition}] with proxy: ${proxy}`);
      });
      ses.setUserAgent(rand_ua());
      const sessionReloadProxy = (removePreviousProxy = false) => {
        if (removePreviousProxy) proxies.remove(proxy);
        // regenerate proxy
        proxy = proxies.random();
        // reset proxy
        ses.setProxy({ proxyRules: proxy }).then(() => {
          console.log(`re-injected [${partition}] with proxy: ${proxy}`);
        });
        if (clearCache) {
          // flush caches and data
          ses.clearCache();
          ses.clearStorageData();
          ses.clearAuthCache();
          ses.clearHostResolverCache();
          // flush cookies
          ses.cookies.flushStore().then(() => {
            // reload window after reset proxy
            win.reload();
          });
        } else {
          // reload window after reset proxy
          win.reload();
        }
      };
      ses.webRequest.onErrorOccurred((details) => {
        if (
          details.resourceType == "mainFrame" &&
          !isAds(new URL(details.url).hostname)
        ) {
          const errors = [
            "ERR_TIMED_OUT",
            "ERR_PROXY_CONNECTION_FAILED",
            "ERR_TUNNEL_CONNECTION_FAILED"
          ];
          // check if the string has some of the terms
          const hasProxyError = errors.some((term) =>
            details.error.toUpperCase().includes(term)
          );

          if (hasProxyError) {
            sessionReloadProxy(true);
          }

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
    });

    // reload multi webview
    win.loadURL("file://" + __dirname + "/views/webview-multi.html");
  }
  injectWebViewProxy();

  win.on("closed", () => {
    win = null;
  });

  globalShortcut.register("f5", function () {
    console.log("reload by f5");
    win.reload();
  });
  globalShortcut.register("CommandOrControl+R", function () {
    console.log("reload by CommandOrControl+R");
    win.reload();
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
