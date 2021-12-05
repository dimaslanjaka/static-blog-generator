import { session } from "electron";

const cleanCache = (ses: Electron.Session) => {
  ses.clearCache();
  ses.clearStorageData();
  ses.clearAuthCache();
  ses.clearHostResolverCache();
};

/**
 * Clear Cache Of Browser Window
 * @param win
 */
export function clearCache(win: Electron.BrowserWindow) {
  const ses = win.webContents.session;
  cleanCache(ses);
}

export function clearCachePartition(name: string) {
  const ses = session.fromPartition(name);
  cleanCache(ses);
}
