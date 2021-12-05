/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../globals.d.ts" />
import { ipcRenderer, session } from "electron";

window.onload = function () {
  ipcRenderer.on("session-error", function (evt, message) {
    console.log("session-error", message);
  });
  const webviews: NodeListOf<Electron.WebviewTag> =
    document.querySelectorAll("webview");
  webviews.forEach((webview) => {
    //console.log("attach listener to webview", webview.attributes);
    webview.addEventListener("dom-ready", (e) => {
      //const x = (<any>e.target).getURL();
      const url = webview.getURL();
      const title = webview.getTitle();
      //console.log(url);
    });
    function reloadWebProxy(partisi: string) {
      ipcRenderer
        .invoke("change-webview-proxy", partisi)
        .then((proxyResult) => {
          const webviewContainer = document.querySelector(
            '[data-partition="' + partisi + '"]'
          );
          if (webviewContainer) {
            const proxyText =
              webviewContainer.querySelector('[data-id="proxy"]');
            proxyText.innerHTML =
              proxyResult + ' <i class="fal fa-sync-alt"></i>';
          }
          webview.reload();
          /*const url = webview.getURL();
          if (url && url.length) {
            webview.setAttribute("src", url);
          }*/
          //webview.loadURL(webview.getURL());
          //webview.src = webview.getURL();
        });
    }
    webview.addEventListener("did-fail-load", (e) => {
      //console.error("fail load", webview.getAttribute("partition"));
      //window.sendToElectron("reload");
      if (["ERR_TIMED_OUT"].includes(e.errorDescription)) {
        const partisi = webview.getAttribute("partition");
        reloadWebProxy(partisi);
        //window.sendToElectron("reload-proxy");
        //console.log("fail load", webview.getAttribute("partition"));
      }
    });
    webview.addEventListener("did-finish-load", (e) => {
      const titlePage = webview.getTitle();
      // skip cloudflare
      if (
        /^please.*wait.*cloudflare$|gateway.*timeout$/gm.test(
          titlePage.toLowerCase()
        )
      ) {
        const partisi = webview.getAttribute("partition");
        reloadWebProxy(partisi);
      } else {
        console.log("success load", titlePage);
      }
    });
  });
};
