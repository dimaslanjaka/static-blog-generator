import { ipcRenderer } from "electron";
import { MyTypeIpcRenderer } from "../../electron-utils/webworker";
import ldloader from "../theme/loader/electronLoader";

const ipr: MyTypeIpcRenderer = ipcRenderer;

document.querySelector("header").remove();
const webviews = document.querySelectorAll("webview");
const loader = new ldloader({ root: "#webviews" });
loader.on();

webviews.forEach((webview: Electron.WebviewTag) => {
  const webviewContainer = webview.parentElement;
  const proxyText = webviewContainer.querySelector('[data-id="proxy"]');
  const partisi = webview.getAttribute("partition");

  const reloadWebProxy = (
    partisi: string,
    clear_cache = false,
    change_useragent = false
  ) => {
    proxyText.setAttribute("class", "text-primary");
    proxyText.innerHTML = "Changing Proxy...";

    if (change_useragent)
      ipr.invoke("change-webview-ua", partisi).then((ua) => {
        console.log(ua);
      });

    ipr.invoke("change-webview-proxy", partisi, clear_cache).then((proxy) => {
      proxyText.innerHTML = proxy;
    });

    console.log(webview.getURL());
    webview.setUserAgent("Electron");
  };

  // loader
  const loadstart = () => {
    loader.on(webview);
  };

  const loadstop = () => {
    loader.off(webview);
  };

  webview.addEventListener("did-start-loading", loadstart);
  webview.addEventListener("did-stop-loading", loadstop);

  // init proxy
  reloadWebProxy(partisi, true, true);

  // process after dom-ready
  webview.addEventListener("dom-ready", (e) => {
    const url = webview.getURL();
    const title = webview.getTitle();
    const titleText = webviewContainer.querySelector('[data-id="title"]');
    titleText.innerHTML = title;
  });

  webview.addEventListener("did-fail-load", (e) => {
    if (["ERR_TIMED_OUT"].includes(e.errorDescription)) {
      reloadWebProxy(partisi);
    }
  });

  webview.addEventListener("did-finish-load", (e) => {
    const titlePage = webview.getTitle();
    // skip cloudflare
    if (
      /^please.*wait.*cloudflare$|gateway.*timeout$|^https?:\/\//gm.test(
        titlePage.toLowerCase()
      )
    ) {
      proxyText.setAttribute("class", "text-danger");
      reloadWebProxy(partisi);
    } else {
      proxyText.setAttribute("class", "text-success");
      console.log("success load", titlePage);
    }
  });
});
