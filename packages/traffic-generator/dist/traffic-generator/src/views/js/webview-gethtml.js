"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fs_2 = require("fs");
const path_1 = __importDefault(require("path"));
module.exports = function (webview) {
    // we can get its URL and display it in the console
    const currentURL = new URL(webview.getURL());
    //console.log("currentURL is : " + currentURL);
    // same thing about the title of the page
    const titlePage = webview.getTitle();
    //console.log("titlePage is : " + titlePage);
    // executing Javascript into the webview to get the full HTML
    webview
        .executeJavaScript(`function gethtml () {
return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
}
gethtml();`)
        .then(
    /**
     * @param {string} html
     */
    (html) => {
        // save HTML
        const savePath = path_1.default.join(process.cwd(), "build/html", currentURL.host, currentURL.pathname, `${titlePage}.html`);
        (0, fs_2.mkdirSync)(path_1.default.dirname(savePath), { recursive: true });
        (0, fs_1.writeFileSync)(savePath, html);
    });
};
//# sourceMappingURL=webview-gethtml.js.map