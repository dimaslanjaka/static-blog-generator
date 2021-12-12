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

export interface siteOptionObject {
  url: string;
  useProxy: boolean;
  /**
   * Clear cache and cookies
   */
  useCache: boolean;
  useAgent: boolean;
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

  handle(
    channel: "change-webview-ua",
    listener: (
      event: IpcMainInvokeEvent,
      partition_name: string,
      ua?: string
    ) => void
  );
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
    channel: "change-webview-ua",
    partition_name: string,
    ua?: string
  ): Promise<string>;
  invoke(
    event: "change-webview-proxy",
    partition_name: string,
    clear_cache?: boolean
  ): Promise<string>;
  //on(event: string, listener: () => any): this;
}
