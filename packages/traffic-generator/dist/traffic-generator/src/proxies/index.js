"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxyWindow = exports.setProxyWindow = exports.getProxyPartition = exports.setProxyPartition = exports.remove = exports.random = void 0;
/* eslint-disable import/extensions */
const axios_1 = __importDefault(require("axios"));
const spys_txt_1 = require("../../packages/proxy-grabber/src/parser/spys.txt");
const db_1 = __importDefault(require("../../packages/proxy-grabber/src/db"));
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
//import "../../../hexo-seo/packages/js-prototypes/src/Array";
require("../../../hexo-seo/packages/js-prototypes/src/globals");
const electron_1 = require("electron");
const proxyFile_1 = __importDefault(require("./proxyFile"));
const db = new db_1.default(path_1.default.join(process.cwd(), "databases/proxies"));
const instance = axios_1.default.create({
    baseURL: "https://httpbin.org/",
    timeout: 10000,
    headers: {},
    // `maxRedirects` defines the maximum number of redirects to follow in node.js.
    // If set to 0, no redirects will be followed.
    maxRedirects: 5
});
const lastUpdated = db.exists("/sslProxiesOrg/lastUpdated")
    ? db.get("/sslProxiesOrg/lastUpdated")
    : 100;
if ((0, moment_1.default)().diff(lastUpdated, "days") > 3) {
    instance.get("http://spys.me/proxy.txt").then((response) => {
        const parsed = (0, spys_txt_1.parser)(response.data);
        db.push("/spys/proxies", parsed);
        db.push("/spys/lastUpdated", new Date());
    });
}
const get = db.get("/spys/proxies");
/**
 * TYPE://IP:PORT
 */
const result = db.get("/spys/electron-proxies", null)
    ? db.get("/spys/electron-proxies")
    : get.map((ret) => {
        return ret.type + "://" + ret.proxy;
    });
exports.default = result;
const random = () => {
    return result.shuffle().random();
};
exports.random = random;
function remove(proxy) {
    if (typeof result[proxy] == "string") {
        if (typeof proxy == "number")
            result.deleteAt(proxy);
        else
            result.unset(proxy);
        db.push("/spys/electron-proxies", result);
    }
    return result;
}
exports.remove = remove;
/**
 * Electron set proxy session by partition name
 * @param name partition name (persist:name or name)
 * @param prx proxy with protocol (http://ip:port socks5://ip:port)
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @returns
 */
function setProxyPartition(name, prx) {
    const ses = electron_1.session.fromPartition(name);
    ses.setProxy({ proxyRules: prx });
    return ses;
}
exports.setProxyPartition = setProxyPartition;
/**
 * Get Proxy from partition
 * @param name
 * @returns
 */
function getProxyPartition(name) {
    const ses = electron_1.session.fromPartition(name);
    return ses.resolveProxy("http://google.com").then((deadpx) => {
        return deadpx;
    });
}
exports.getProxyPartition = getProxyPartition;
/**
 * Electron set proxy to window session
 * @param win BrowserWindow Instance
 * @param prx proxy with protocol (http://ip:port socks4://ip:port)
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @returns
 */
function setProxyWindow(win, prx) {
    return win.webContents.session.setProxy({ proxyRules: prx });
}
exports.setProxyWindow = setProxyWindow;
/**
 * Get proxy from electron window
 * @param win
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @returns
 */
function getProxyWindow(win) {
    return win.webContents.session
        .resolveProxy("http://google.com")
        .then((prx) => {
        return proxyFile_1.default.parseProxyFromText(prx);
    });
}
exports.getProxyWindow = getProxyWindow;
//# sourceMappingURL=index.js.map