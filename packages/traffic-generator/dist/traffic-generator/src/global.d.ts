import { BrowserWindow } from "electron";
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
export declare function shortcutInit(win: BrowserWindow): void;
//# sourceMappingURL=global.d.ts.map