import list from "./socks5.json";
import "../../../hexo-seo/packages/js-prototypes/src/Array";
import path from "path";
import exitHandler from "../../../hexo-seo/src/utils/cleanup";
import { readFileSync, writeFileSync } from "fs";

export default class {
  file = path.join(__dirname, "socks5.json");

  win: Electron.BrowserWindow;

  constructor(winx: Electron.BrowserWindow) {
    this.win = winx;
  }

  getAllProxies(): string[] {
    const read = readFileSync(this.file, "utf8").toString();
    const json = JSON.parse(read);
    return json;
  }

  getRandom() {
    //console.log(list);
    const r: string = list.random();
    return "socks5://" + r;
  }

  deleteProxy(prx: string) {
    const proxies = this.getAllProxies();
    console.log("proxy total before", proxies.length);
    proxies.unset(prx);
    const index = proxies.indexOf(prx);
    if (index > -1) {
      proxies.splice(index, 1);
    }
    console.log("proxy total after", list.length, proxies[prx]);
    const file = this.file;
    exitHandler("proxy-socks5", function () {
      writeFileSync(file, JSON.stringify(proxies));
    });
  }
}
