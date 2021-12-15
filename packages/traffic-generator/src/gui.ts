// GUI Options
import { app, BrowserWindow, ipcMain, session } from "electron";
import path from "path";
import proxyFile from "./proxies/proxyFile";
import { readFile } from "../../hexo-seo/src/fm";
import MenuBuilder from "./gui.menu";
import { Config, shortcutInit } from "./global";
import Theme from "./views/theme";
import { DB_PROXIES_KEY } from "./db/constant";
import DBConstructor from "./db";
import { MyTypeIpcMain } from "./electron-utils/webworker";
import { clearCachePartition } from "./utils/cache";
import { getProxyPartition, setProxyPartition } from "./proxies";
import { userAgentRandom } from "./utils/useragent";

const ipm: MyTypeIpcMain = ipcMain;
// load config
const config: Config = JSON.parse(
  readFile(path.join(process.cwd(), "config.json")).toString()
);
// database folder
const dbf = path.join(process.cwd(), "databases");
// database class
const db = new DBConstructor(dbf);
const proxies = db.get(DB_PROXIES_KEY, []) as string[];
// load proxy
const proxy = proxyFile.fromText(proxies.join("\n"));
const win: BrowserWindow[] = [];
const theme = new Theme(path.join(__dirname, "views/routes"));

app.setPath("userData", path.join(process.cwd(), "build/electron/cache"));
app.setPath("userCache", path.join(process.cwd(), "build/electron/data"));
app.whenReady().then(async () => {
  //app.allowRendererProcessReuse = false;
  createNewWindow("options");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipm.on("new-window", (e, msg) => {
  const routePath = path.basename(msg[0], ".html");
  //console.log(routePath, theme.route(routePath).getPath());
  createNewWindow(routePath);
});

ipm.on("reload-theme", () => {
  console.log("theme reloaded");
});

ipm.handle("change-webview-ua", function (evt, partisi, ua) {
  let agent: string;
  if (typeof ua == "string") {
    agent = ua;
  } else {
    agent = userAgentRandom();
  }
  const ses = session.fromPartition(partisi);
  ses.setUserAgent(agent);
  return agent;
});

// handle proxy change webview
ipm.handle("change-webview-proxy", (event, partisi, clear_cache) => {
  if (clear_cache) {
    clearCachePartition(partisi);
  }
  const prx = proxy.random();
  return getProxyPartition(partisi).then((deadpx) => {
    proxy.delete(deadpx);
    setProxyPartition(partisi, prx);
    return prx;
  });
});

function createNewWindow(routePath = "/") {
  win[routePath] = createWindow();
  shortcutInit(win[routePath]);
  const menuBuilder = new MenuBuilder(win[routePath]);
  menuBuilder.buildMenu();

  const renderer = theme.route(routePath).getPath(true);

  win[routePath].loadURL(renderer);

  win[routePath].once("ready-to-show", () => {
    win[routePath].show();
    win[routePath].webContents.openDevTools();
  });

  // Emitted when the window is closed.
  win[routePath].on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win[routePath] = null;
  });

  return win;
}

function createWindow() {
  return new BrowserWindow({
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
}
