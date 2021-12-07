import { BrowserWindow } from "electron";
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
export declare function shortcutInit(win: BrowserWindow): void;
//# sourceMappingURL=global.d.ts.map