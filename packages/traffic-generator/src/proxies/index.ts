/* eslint-disable import/extensions */
import axios from "axios";
import {
  parser as spys,
  returnObj
} from "../../packages/proxy-grabber/src/parser/spys.txt";
import dbc from "../../packages/proxy-grabber/src/db";
import path from "path";
import moment from "moment";
//import "../../../hexo-seo/packages/js-prototypes/src/Array";
import "../../../hexo-seo/packages/js-prototypes/src/globals";
import { BrowserWindow, session } from "electron";
import proxyFile from "./proxyFile";

const db = new dbc(path.join(process.cwd(), "databases/proxies"));
const instance = axios.create({
  baseURL: "https://google.com/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, no redirects will be followed.
  maxRedirects: 5
});

const lastUpdated = db.exists("/sslProxiesOrg/lastUpdated")
  ? db.get("/sslProxiesOrg/lastUpdated")
  : 100;
if (moment().diff(lastUpdated, "days") > 3) {
  instance.get("http://spys.me/proxy.txt").then((response) => {
    const parsed = spys(response.data);
    db.push("/spys/proxies", parsed);
    db.push("/spys/lastUpdated", new Date());
  });
}

const get: returnObj[] = db.get("/spys/proxies");
/**
 * TYPE://IP:PORT
 */
const result = db.get("/spys/electron-proxies", null)
  ? db.get("/spys/electron-proxies")
  : get.map((ret) => {
      return ret.type + "://" + ret.proxy;
    });

export default result;
export const random = (): string => {
  return result.shuffle().random();
};
export function remove(proxy: string | number) {
  if (typeof result[proxy] == "string") {
    if (typeof proxy == "number") result.deleteAt(proxy);
    else result.unset(proxy);
    db.push("/spys/electron-proxies", result);
  }
  return result;
}

/**
 * Electron set proxy session by partition name
 * @param name partition name (persist:name or name)
 * @param prx proxy with protocol (http://ip:port socks5://ip:port)
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @returns
 */
export function setProxyPartition(name: string, prx: string) {
  const ses = session.fromPartition(name);
  ses.setProxy({ proxyRules: prx });
  return ses;
}

/**
 * Get Proxy from partition
 * @param name
 * @returns
 */
export function getProxyPartition(name: string) {
  const ses = session.fromPartition(name);
  return ses.resolveProxy("http://google.com").then((deadpx) => {
    return deadpx;
  });
}

/**
 * Electron set proxy to window session
 * @param win BrowserWindow Instance
 * @param prx proxy with protocol (http://ip:port socks4://ip:port)
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @returns
 */
export function setProxyWindow(win: BrowserWindow, prx: string) {
  return win.webContents.session.setProxy({ proxyRules: prx });
}

/**
 * Get proxy from electron window
 * @param win
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 * @returns
 */
export function getProxyWindow(win: BrowserWindow) {
  return win.webContents.session
    .resolveProxy("http://google.com")
    .then((prx) => {
      return proxyFile.parseProxyFromText(prx);
    });
}
