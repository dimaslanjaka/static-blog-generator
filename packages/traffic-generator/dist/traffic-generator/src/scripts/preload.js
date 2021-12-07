/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/// <reference path="../views/globals.d.ts" />
const { contextBridge, ipcRenderer } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element)
            element.innerText = text;
    };
    for (const dependency of ["chrome", "node", "electron"]) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});
window.sendToElectron = function (channel, ...args) {
    ipcRenderer.send(channel, args);
};
// see: https://github.com/microsoft/TypeScript/issues/30718#issuecomment-479609634
//const exports = {};
global.exports = {};
//# sourceMappingURL=preload.js.map