/**
 * Electron Browser Window Proxy
 * @param win
 * @param proxy ex "socks5://88.198.50.103:1080"
 */
declare function windowProxy(win: Electron.BrowserWindow, proxy: string, callback?: (proxy: string, errorCode: number | null, errorDescription: string, validatedURL: string, isMainFrame: boolean | null) => any): void;
export default windowProxy;
//# sourceMappingURL=window-proxy.d.ts.map