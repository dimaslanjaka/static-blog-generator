/**
 * Electron Browser Window Proxy
 * @param win
 * @param proxy ex "socks5://88.198.50.103:1080"
 */
function windowProxy(
  win: Electron.BrowserWindow,
  proxy: string,
  callback?: (
    proxy: string,
    errorCode: number | null,
    errorDescription: string,
    validatedURL: string,
    isMainFrame: boolean | null
  ) => any
) {
  win.webContents.session
    .setProxy({ proxyRules: proxy })
    .then(() => {
      win.loadURL("https://www.webmanajemen.com/page/bot-detect");
    })
    .catch((err) => {});

  /* Set did-fail-load listener once, load default view */
  win.webContents.on(
    "did-fail-load",
    function (
      event: Electron.Event,
      errorCode: number,
      errorDescription: string,
      validatedURL: string,
      isMainFrame: boolean,
      frameProcessId: number,
      frameRoutingId: number
    ) {
      if (typeof callback == "function" && isMainFrame) {
        callback(proxy, errorCode, errorDescription, validatedURL, isMainFrame);
      }
    }
  );

  win.webContents.on("did-finish-load", function () {
    const title = win.getTitle();
    if (title.toLowerCase().startsWith("attention required!")) {
      if (typeof callback === "function") {
        callback(
          proxy,
          null,
          "Proxy blocked by cloudflare",
          win.webContents.getURL(),
          null
        );
      }
    }
    //console.log(win.getTitle());
  });
}

export default windowProxy;
