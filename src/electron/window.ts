import { BrowserWindow } from "electron";
import { port } from "../config";

export default function () {
  let mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 640,
    height: 480,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      spellcheck: true,
    },
    show: false,
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  //mainWindow.loadURL(`file://${__dirname}/views/cookie.html`);
  mainWindow.loadURL("http://127.0.0.1:" + port).then((r) => console.log(r));
  //mainWindow.webContents.openDevTools();
  mainWindow.on("close", () => {
    mainWindow.webContents.send("stop-server");
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  return mainWindow;
}
