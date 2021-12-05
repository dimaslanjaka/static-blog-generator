"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function default_1(win, partition) {
    win.webContents.on("did-finish-load", (event) => {
        if (!partition) {
            // Query all cookies.
            electron_1.session.defaultSession.cookies
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
exports.default = default_1;
function saveCookies(win) {
    win.webContents.session.cookies.get({}).then((cookies) => {
        console.log(cookies);
    });
}
function restoreCookies(win, cookies) {
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
//# sourceMappingURL=cookies.js.map