// Dynamic webview full control from renderer
import { app, BrowserWindow, session } from "electron";
import path from "path";
import proxyFile from "./proxies/proxyFile";
import { readFile } from "../../hexo-seo/src/fm";
import { getProxyWindow, setProxyWindow } from "./proxies";
import { Config, shortcutInit } from "./global";

// load config
const config: Config = JSON.parse(
  readFile(path.join(process.cwd(), "config.json")).toString()
);

// load proxy
const proxy = new proxyFile(path.join(process.cwd(), config.proxy));
let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    //frame: false, // hide dock
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

app.setPath("userData", path.join(process.cwd(), "build/electron/cache"));
app.setPath("userCache", path.join(process.cwd(), "build/electron/data"));
app.whenReady().then(async () => {
  createWindow();
  await setProxyWindow(win, proxy.random());
  win.loadURL("https://www.webmanajemen.com/page/bot-detect");
  //win.loadURL("https://www.google.com/search?q=what+is+my+ip");
  win.once("ready-to-show", (e, top) => {
    win.show();
    //win.webContents.openDevTools({ mode: "bottom" });
  });

  const reloadProxy = async () => {
    const prx = await getProxyWindow(win);
    proxy.delete(prx[0]);
    await setProxyWindow(win, proxy.random());
    win.reload();
  };

  win.webContents.on(
    "did-fail-load",
    async function (
      event: Electron.Event,
      errorCode: number,
      errorDescription: string,
      validatedURL: string,
      isMainFrame: boolean,
      frameProcessId: number,
      frameRoutingId: number
    ) {
      reloadProxy();
    }
  );

  win.webContents.on("did-finish-load", async function () {
    const title = win.webContents.getTitle().trim();
    if (title.toLowerCase().startsWith("attention required!")) {
      win.setTitle("proxy blocked by cloudflare");
      return reloadProxy();
    }
    const prx = await getProxyWindow(win);
    win.setTitle(title.substring(0, 150) + ` ${prx}`);
  });

  // set shortcut
  shortcutInit(win);
});
