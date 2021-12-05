declare function webviewProxy(proxy: string, partition?: string, callback?: (details: Electron.OnErrorOccurredListenerDetails, proxy: string, partition: string) => any): void;
/**
 * detect url is ads?
 * @param url
 * @param debug
 * @returns
 */
export declare function isAds(url: string, debug?: boolean): boolean;
export default webviewProxy;
//# sourceMappingURL=webview-proxy.d.ts.map