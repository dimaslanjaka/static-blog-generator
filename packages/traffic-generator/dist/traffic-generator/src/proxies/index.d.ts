import "../../../hexo-seo/packages/js-prototypes/src/globals";
import { BrowserWindow } from "electron";
/**
 * TYPE://IP:PORT
 */
declare const result: any;
export default result;
export declare const random: () => string;
export declare function remove(proxy: string | number): any;
/**
 * Electron set proxy session by partition name
 * @param name partition name (persist:name or name)
 * @param prx proxy with protocol (http://ip:port socks5://ip:port)
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @returns
 */
export declare function setProxyPartition(name: string, prx: string): Promise<void>;
/**
 * Electron set proxy to window session
 * @param win BrowserWindow Instance
 * @param prx proxy with protocol (http://ip:port socks4://ip:port)
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @returns
 */
export declare function setProxyWindow(win: BrowserWindow, prx: string): Promise<void>;
/**
 * Get proxy from electron window
 * @param win
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @returns
 */
export declare function getProxyWindow(win: BrowserWindow): Promise<string[]>;
//# sourceMappingURL=index.d.ts.map