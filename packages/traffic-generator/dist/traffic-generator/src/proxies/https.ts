import { readFileSync, writeFileSync } from "fs";
import path from "path";
import sslproxies from "../__test__/data/sslproxies.json";
import httpsproxies from "./https.json";
import "../../../hexo-seo/packages/js-prototypes/src/Array";
import exitHandler from "../../../hexo-seo/src/utils/cleanup";

let list: string[] = [];

export default class {
  file = path.join(__dirname, "../__test__/data/sslproxies.json");
  win: Electron.BrowserWindow;

  constructor(winx: Electron.BrowserWindow) {
    this.win = winx;
    list = list.concat(this.concatProxies());
  }

  private concatProxies() {
    const fileProxies = [
      path.join(__dirname, "../__test__/data/sslproxies.json"),
      path.join(__dirname, "./https.json")
    ];
    fileProxies.map((file) => {
      const read = readFileSync(file, "utf8").toString();
      try {
        const json = JSON.parse(read);
        if (Array.isArray(json)) {
          list = list.concat(json).unique().shuffle();
        }
      } catch (error) {
        return;
      }
    });
    return list;
  }

  private fold() {
    return httpsproxies.concat(sslproxies);
  }

  getAllProxies(): string[] {
    return this.concatProxies();
  }

  getRandom() {
    //console.log(list);
    const r: string = list.random();
    return "http://" + r;
  }

  deleteProxy(prx: string) {
    prx = prx.replace(/^(socks?[54]|https?):\/\//gs, "");
    const proxies = this.getAllProxies();
    console.log("proxy total before", proxies.length);
    proxies.unset(prx);
    const index = proxies.indexOf(prx);
    if (index > -1) {
      proxies.splice(index, 1);
    }
    console.log("proxy total after", proxies.length, [prx, index]);
    const file = this.file;
    exitHandler("proxy-https", function () {
      writeFileSync(file, JSON.stringify(proxies));
    });
  }
}
