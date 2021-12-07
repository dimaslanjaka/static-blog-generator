import { BrowserWindow, globalShortcut } from "electron";
import { GenericObject } from "./electron-utils/webworker";

export interface WebviewInstances extends GenericObject {
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
export interface Config extends GenericObject {
  /**
   * Proxy file (txt) path
   */
  proxy: string;
  webview: WebviewInstances;
}

/**
 * Shortcut initializer (automated find active window)
 * @see {@link https://stackoverflow.com/a/64502431}
 * @param win
 */
export function shortcutInit(win: BrowserWindow) {
  win.on("focus", () => {
    globalShortcut.register("f5", function () {
      console.log("reload by f5");
      win.reload();
    });
    globalShortcut.register("ESC", function () {
      if (win.closable) win.close();
    });
    globalShortcut.register("CommandOrControl+R", function () {
      console.log("reload by CommandOrControl+R");
      win.reload();
    });
  });

  win.on("blur", () => {
    globalShortcut.unregisterAll();
  });
}
