"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electronLoader_1 = __importDefault(require("../theme/loader/electronLoader"));
const ipr = electron_1.ipcRenderer;
document.querySelector("header").remove();
const webviews = document.querySelectorAll("webview");
const loader = new electronLoader_1.default({ root: "#webviews" });
loader.on();
webviews.forEach((webview) => {
    const webviewContainer = webview.parentElement;
    const proxyText = webviewContainer.querySelector('[data-id="proxy"]');
    const partisi = webview.getAttribute("partition");
    const reloadWebProxy = (partisi) => {
        proxyText.setAttribute("class", "text-primary");
        proxyText.innerHTML = "Changing Proxy...";
        ipr.invoke("change-webview-proxy", partisi).then((proxy) => {
            proxyText.innerHTML = proxy;
        });
    };
    // init proxy
    reloadWebProxy(partisi);
    // loader
    const loadstart = () => {
        loader.on(webview);
    };
    const loadstop = () => {
        loader.off(webview);
    };
    webview.addEventListener("did-start-loading", loadstart);
    webview.addEventListener("did-stop-loading", loadstop);
    //console.log("attach listener to webview", webview.attributes);
    webview.addEventListener("dom-ready", (e) => {
        //const x = (<any>e.target).getURL();
        const url = webview.getURL();
        const title = webview.getTitle();
        const titleText = webviewContainer.querySelector('[data-id="title"]');
        titleText.innerHTML = title;
        //console.log(url);
    });
    webview.addEventListener("did-fail-load", (e) => {
        if (["ERR_TIMED_OUT"].includes(e.errorDescription)) {
            reloadWebProxy(partisi);
        }
    });
    webview.addEventListener("did-finish-load", (e) => {
        const titlePage = webview.getTitle();
        // skip cloudflare
        if (/^please.*wait.*cloudflare$|gateway.*timeout$|^https?:\/\//gm.test(titlePage.toLowerCase())) {
            proxyText.setAttribute("class", "text-danger");
            reloadWebProxy(partisi);
        }
        else {
            proxyText.setAttribute("class", "text-success");
            console.log("success load", titlePage);
        }
    });
});
//# sourceMappingURL=surf.js.map