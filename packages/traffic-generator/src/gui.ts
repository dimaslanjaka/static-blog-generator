// GUI Options
import { app, BrowserWindow, ipcMain, session } from "electron";
import path from "path";
import proxyFile from "./proxies/proxyFile";
import { readFile } from "../../hexo-seo/src/fm";
import MenuBuilder from "./gui.menu";
import { Config, shortcutInit } from "./global";
import Theme from "./views/theme";

// load config
const config: Config = JSON.parse(
  readFile(path.join(process.cwd(), "config.json")).toString()
);

// load proxy
const proxy = new proxyFile(path.join(process.cwd(), config.proxy));
//let win: BrowserWindow;
const theme = new Theme(path.join(__dirname, "views/routes"));

app.setPath("userData", path.join(process.cwd(), "build/electron/cache"));
app.setPath("userCache", path.join(process.cwd(), "build/electron/data"));
app.whenReady().then(async () => {
  //app.allowRendererProcessReuse = false;
  createNewWindow("options");
});

function createNewWindow(routePath: string) {
  const win = createWindow();
  shortcutInit(win);
  const menuBuilder = new MenuBuilder(win);
  menuBuilder.buildMenu();

  const renderer = theme.route(routePath).getPath(true);

  win.loadURL(renderer);

  win.once("ready-to-show", () => {
    win.show();
    win.webContents.openDevTools();
  });

  ipcMain.on("new-window", (e, msg) => {
    console.log(msg);
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
