"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const webview_proxy_1 = require("./proxies/webview-proxy");
const proxyFile_1 = __importDefault(require("./proxies/proxyFile"));
const fm_1 = require("../../hexo-seo/src/fm");
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const global_1 = require("./global");
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        frame: false,
        width: 1000,
        height: 600,
        center: true,
        show: false,
        title: "Dynamic Traffic Automator <dimaslanjaka@gmail.com>",
        webPreferences: {
            preload: path_1.default.join(__dirname, "scripts/preload.js"),
            partition: "persist:webviewsession",
            webviewTag: true,
            webSecurity: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false // open node
        }
    });
    return win;
}
// load config
const config = JSON.parse((0, fm_1.readFile)(path_1.default.join(process.cwd(), "config.json")).toString());
// load proxy
const proxy = new proxyFile_1.default(path_1.default.join(process.cwd(), config.proxy));
electron_1.app.setPath("userData", path_1.default.join(process.cwd(), "build/electron/cache"));
electron_1.app.setPath("userCache", path_1.default.join(process.cwd(), "build/electron/data"));
electron_1.app.whenReady().then(() => {
    createWindow();
    const loadWebview = () => {
        const fileIndex = path_1.default.join(__dirname, "/views/dynamic-webview.html");
        const read = (0, fm_1.readFile)(fileIndex).toString();
        const parse = (0, node_html_parser_1.default)(read);
        // webviews containers
        const webviews = parse.querySelector("#webviews");
        let i = 0;
        const mwebview = {};
        const partitions = [];
        for (const [url, value] of Object.entries(config.webview)) {
            // initialize variable
            i += 1;
            const persist = "persist:multi" + i;
            partitions.push(persist);
            const wconfig = Object.assign({}, value);
            // prepare session
            const ses = electron_1.session.fromPartition(persist);
            if (wconfig.clean) {
                ses.clearAuthCache();
                ses.clearCache();
                ses.clearHostResolverCache();
                ses.clearStorageData();
                ses.cookies.flushStore();
            }
            ses.on("will-download", function (e) {
                e.preventDefault();
            });
            // generate proxy
            let singleproxy = proxy.random();
            if (wconfig.proxy) {
                // reset proxy
                ses.setProxy({ proxyRules: "http://" + singleproxy }).then(() => {
                    console.log(`[${persist}] : ${singleproxy}`);
                });
            }
            // session error handler
            ses.webRequest.onErrorOccurred((details) => {
                if (details.resourceType == "mainFrame" &&
                    !(0, webview_proxy_1.isAds)(new URL(details.url).hostname)) {
                    // ignore manual cancel
                    const manualCancel = ["ERR_ABORTED"].some((term) => details.error.toUpperCase().includes(term));
                    if (manualCancel)
                        return;
                    // check if the string has some of the terms
                    const hasProxyError = [
                        "ERR_TIMED_OUT",
                        "ERR_PROXY_CONNECTION_FAILED",
                        "ERR_TUNNEL_CONNECTION_FAILED"
                    ].some((term) => details.error.toUpperCase().includes(term));
                    if (hasProxyError) {
                        if (wconfig.proxy) {
                            ses.resolveProxy("http://google.com").then((px) => {
                                proxy.delete(px);
                                //console.log("dead proxy", px);
                            });
                            // regenerate proxy
                            singleproxy = proxy.random();
                            // reset proxy
                            ses.setProxy({ proxyRules: "http://" + singleproxy }).then(() => {
                                console.log(`reset [${persist}] : ${singleproxy}`);
                            });
                            // uncomment to handle errors serverside
                            // return win.reload();
                        }
                    }
                    win.webContents.send("session-error", {
                        error: hasProxyError ? "proxy" : "webpage",
                        url: details.url,
                        message: details.error
                    });
                    console.log(hasProxyError ? "proxy error" : "request error", details.error, details.url);
                } /*else if (details.resourceType == "subFrame") {
                  //console.log("error loading url", details.url, details.resourceType);
                  if (
                    /googlesyndication|googleads\.g\.doubleclick\.net/g.test(
                      details.url
                    )
                  ) {
                    sessionReloadProxy();
                  }
                }*/
            });
            // prepare webview
            const swebview = (0, fm_1.readFile)(path_1.default.join(__dirname, "/views/webview.html"))
                .toString()
                .replace(/%n%/g, i.toString())
                .replace("%url%", url)
                .replace("%id%", persist.replace(/[\W_]+/g, ""));
            const div = `<div data-id="webview" data-partition="${persist}" class="col-md-6 d-flex pb-3"><div class="card card-block">
    <h3 class="card-title"><span data-id="partition">${persist}</span> <span data-id="proxy">${singleproxy}</span></h3>
    ${swebview}
    </div></div>`;
            mwebview[persist] = div;
        }
        webviews.set_content(Object.values(mwebview).join(""));
        (0, fm_1.writeFile)(fileIndex, parse.toString());
        win.loadURL("file://" + fileIndex);
    };
    loadWebview();
    electron_1.ipcMain.on("reload", (e, msg) => {
        console.log("reload by ipcMain");
        win.reload();
    });
    // handle proxy change webview
    electron_1.ipcMain.handle("change-webview-proxy", (event, partisi) => {
        const prx = proxy.random();
        const ses = electron_1.session.fromPartition(partisi);
        ses.resolveProxy("http://google.com").then((deadpx) => {
            proxy.delete(deadpx);
        });
        ses.setProxy({ proxyRules: "http://" + prx });
        return prx;
    });
    win.once("ready-to-show", function () {
        win.show();
        win.webContents.openDevTools({ mode: "bottom" });
        //win.minimize();
    });
    // handle new tab link open
    win.webContents.setWindowOpenHandler((details) => {
        const url = details.url;
        console.log("window need open", url);
        /*if (url === "about:blank") {
          return {
            action: "allow",
            overrideBrowserWindowOptions: {
              frame: false,
              fullscreenable: false,
              backgroundColor: "black",
              webPreferences: {
                //preload: "my-child-window-preload-script.js"
                webviewTag: true,
                partition: "persist:webviewsession"
              }
            }
          };
        }*/
        return { action: "deny" };
    });
    // set shortcut
    (0, global_1.shortcutInit)(win);
    win.on("closed", () => {
        win = null;
    });
    electron_1.app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            electron_1.app.quit();
        }
    });
    electron_1.app.on("activate", () => {
        if (win === null) {
            createWindow();
        }
    });
});
//# sourceMappingURL=dynamic-webview-multi.js.map