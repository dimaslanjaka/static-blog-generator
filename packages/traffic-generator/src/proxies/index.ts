import { returnObj } from "proxies-grabber/dist/traffic-generator/packages/proxy-grabber/src/spys";
import proxyGrabber from "proxies-grabber";
import "../../../hexo-seo/packages/js-prototypes/src/Array";

const grabber = new proxyGrabber();

let list: returnObj[] = [];
const deadProxy: string[] = [];

export default class {
  deleteProxy(proxy: string) {
    deadProxy.push(proxy);
  }
  getRandom() {
    list = list.shuffle();
    for (let index = 0; index < 40; index++) {
      const proxy: returnObj = list.random();
      const result = proxy.type + "://" + proxy.proxy;
      if (!deadProxy.includes(result)) return result;
    }
  }
  win: Electron.BrowserWindow;

  constructor(winx: Electron.BrowserWindow) {
    this.win = winx;
    grabber.get().then((px) => {
      console.log(px);
      px.forEach((prx) => {
        list.push(prx);
      });
    });
  }
}
