export default function (win: Electron.BrowserWindow, ua: string) {
  return win.webContents.setUserAgent(ua);
}
