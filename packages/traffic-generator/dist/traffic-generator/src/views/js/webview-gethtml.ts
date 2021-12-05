import { writeFileSync } from "fs";
import { mkdirSync } from "fs";
import path from "path";

module.exports = function (webview: Electron.WebviewTag) {
  // we can get its URL and display it in the console
  const currentURL = new URL(webview.getURL());
  //console.log("currentURL is : " + currentURL);

  // same thing about the title of the page
  const titlePage = webview.getTitle();
  //console.log("titlePage is : " + titlePage);

  // executing Javascript into the webview to get the full HTML
  webview
    .executeJavaScript(
      `function gethtml () {
return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
}
gethtml();`
    )
    .then(
      /**
       * @param {string} html
       */
      (html) => {
        // save HTML
        const savePath = path.join(
          process.cwd(),
          "build/html",
          currentURL.host,
          currentURL.pathname,
          `${titlePage}.html`
        );
        mkdirSync(path.dirname(savePath), { recursive: true });
        writeFileSync(savePath, html);
      }
    );
};
