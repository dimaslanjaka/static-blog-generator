import { session, app } from "electron";

export default function (win: Electron.BrowserWindow, partition?: string) {
  win.webContents.on("did-finish-load", (event) => {
    if (!partition) {
      // Query all cookies.
      session.defaultSession.cookies
        .get({})
        .then((cookies) => {
          console.log(cookies);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}

function saveCookies(win: Electron.BrowserWindow) {
  win.webContents.session.cookies.get({}).then((cookies) => {
    console.log(cookies);
  });
}

function restoreCookies(win: Electron.BrowserWindow, cookies: any[]) {
  for (const cookie of cookies) {
    const scheme = cookie.secure ? "https" : "http";
    const host = cookie.domain.startsWith(".")
      ? cookie.domain.substr(1)
      : cookie.domain;

    cookie.url = `${scheme}://${host}`;

    /*win.webContents.session.cookies.set(cookie, (err) => {
    });*/
  }
}
