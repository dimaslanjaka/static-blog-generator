import { app, BrowserWindow, globalShortcut, session } from "electron";
import path from "path";
import { isAds } from "./proxies/webview-proxy";
import * as proxies from "./proxies";
import { random as rand_ua } from "./utils/useragent";
import { readFile, writeFile } from "../../hexo-seo/src/fm";
import htmlParser from "node-html-parser";
let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    center: true,
    show: false, // hide first initialize
    title: "Dynamic Traffic Automator <dimaslanjaka@gmail.com>",
    webPreferences: {
      partition: "persist:webviewsession",
      webviewTag: true,
      webSecurity: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  return win;
}
interface LooseObject {
  [key: string]: any;
}

interface WebviewInstances extends LooseObject {
  [key: string]: {
    /**
     * Clean on proxy change
     */
    clean?: boolean;
  };
}
interface Config extends LooseObject {
  /**
   * Proxy file (txt) path
   */
  proxy: string;
  webview: WebviewInstances;
}

// load config
const config: Config = JSON.parse(
  readFile(path.join(process.cwd(), "config.json")).toString()
);

// load proxy
const proxy: string[] = readFile(path.join(process.cwd(), config.proxy))
  .toString()
  .split("\n");

app.setPath("userData", path.join(process.cwd(), "build/electron/cache"));
app.setPath("userCache", path.join(process.cwd(), "build/electron/data"));
app.whenReady().then(() => {
  createWindow();

  const fileIndex = path.join(__dirname, "/views/dynamic-webview.html");
  const read = readFile(fileIndex).toString();
  const parse = htmlParser(read);
  // webviews containers
  const webviews = parse.querySelector("#webviews");
  let i = 0;
  const mwebview: string[] = [];
  for (const [key, value] of Object.entries(config.webview)) {
    i += 1;
    const wconfig = config[key];
    const swebview = readFile(path.join(__dirname, "/views/webview.html"))
      .toString()
      .replace("%n%", i.toString())
      .replace("%url%", key);
    const div = `<div class="col-md-6 d-flex pb-3"><div class="card card-block">
          ${swebview}
      </div></div>`;
    mwebview.push(div);
  }
  webviews.set_content(mwebview.join(""));
  //writeFile(fileIndex, parse.toString());
  //win.loadURL("file://" + fileIndex);
  //console.log(parse.toString());
  win.loadURL("data:text/html;charset=utf-8," + parse.toString());

  win.on("ready-to-show", function () {
    if (mwebview.length > 0) win.show();
  });

  // set shortcut
  globalShortcut.register("f5", function () {
    console.log("reload by f5");
    win.reload();
  });
  globalShortcut.register("CommandOrControl+R", function () {
    console.log("reload by CommandOrControl+R");
    win.reload();
  });

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
