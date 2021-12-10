import { BrowserWindow, IpcMainEvent, IpcRenderer, IpcMain, IpcMainInvokeEvent } from "electron";
import "../../../hexo-seo/packages/js-prototypes/src/Object";
export declare type GenericObject = {
    [key: string]: any;
};
export declare function sendToRenderer(win: BrowserWindow | IpcMainEvent, event: string, arg?: GenericObject): void;
export interface MyTypeIpcMain extends IpcMain {
    handle(channel: "change-webview-proxy", listener: (event: IpcMainInvokeEvent, partition_name: string, clear_cache?: boolean) => Promise<void> | any): void;
    handle(channel: "change-webview-ua", listener: (event: IpcMainInvokeEvent, partition_name: string, ua?: string) => void): any;
}
/**
 * Extends IpcRenderer Type
 */
export interface MyTypeIpcRenderer extends IpcRenderer {
    on(event: "proxy-changed", listener: (evt: Electron.IpcRendererEvent, messages: {
        proxy: string;
    }) => void): this;
    invoke(channel: "change-webview-ua", partition_name: string, ua?: string): Promise<string>;
    invoke(event: "change-webview-proxy", partition_name: string, clear_cache?: boolean): Promise<string>;
}
//# sourceMappingURL=webworker.d.ts.map