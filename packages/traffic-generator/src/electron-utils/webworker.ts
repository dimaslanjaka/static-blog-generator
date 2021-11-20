import EventEmitter from "events";
import "../../../hexo-seo/packages/js-prototypes/src/Object";
export type GenericObject = { [key: string]: any };
const loadingEvents = new EventEmitter();
export function sendToRenderer(
  win: Electron.BrowserWindow,
  event: string,
  arg: GenericObject = {}
) {
  win.webContents.send(event, arg);
}
