import {
  BrowserWindow,
  IpcMainEvent,
  IpcRenderer,
  IpcMain,
  IpcMainInvokeEvent
} from "electron";
import EventEmitter from "events";
import "../../../hexo-seo/packages/js-prototypes/src/Object";

export type GenericObject = { [key: string]: any };
const loadingEvents = new EventEmitter();
export function sendToRenderer(
  win: BrowserWindow | IpcMainEvent,
  event: string,
  arg: GenericObject = {}
) {
  if (win instanceof BrowserWindow) {
    win.webContents.send(event, arg);
  } else {
    win.sender.send(event, arg);
  }
}

export interface MyTypeIpcMain extends IpcMain {
  handle(
    channel: "change-webview-proxy",
    listener: (
      event: IpcMainInvokeEvent,
      partition_name: string,
      clear_cache?: boolean
    ) => Promise<void> | any
  ): void;
}

/**
 * Extends IpcRenderer Type
 */
export interface MyTypeIpcRenderer extends IpcRenderer {
  on(
    event: "proxy-changed",
    listener: (
      evt: Electron.IpcRendererEvent,
      messages: { proxy: string }
    ) => void
  ): this;
  invoke(
    event: "change-webview-proxy",
    partition_name: string,
    clear_cache?: boolean
  ): Promise<string>;
  //on(event: string, listener: () => any): this;
}
