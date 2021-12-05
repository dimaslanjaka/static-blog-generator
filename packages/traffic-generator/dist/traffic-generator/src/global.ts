import { BrowserWindow, globalShortcut } from "electron";

export interface LooseObject {
  [key: string]: any;
}

export interface WebviewInstances extends LooseObject {
  [key: string]: {
    /**
     * Clean on proxy change
     */
    clean?: boolean;
    /**
     * Use proxy
     */
    proxy?: boolean;
  };
}
export interface Config extends LooseObject {
  /**
   * Proxy file (txt) path
   */
  proxy: string;
  webview: WebviewInstances;
}

export function shortcutInit(win: BrowserWindow) {
  globalShortcut.register("f5", function () {
    console.log("reload by f5");
    win.reload();
  });
  globalShortcut.register("CommandOrControl+R", function () {
    console.log("reload by CommandOrControl+R");
    win.reload();
  });
}
