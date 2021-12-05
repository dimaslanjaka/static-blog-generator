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
const result: string[] = [];
get.forEach((ret) => {
  result.push(ret.type + "://" + ret.proxy);
});

export default result;
export const random = (): string => {
  return result.shuffle().random();
};
export function remove(proxy: string | number) {
  if (typeof result[proxy] == "string") {
    if (typeof proxy == "number") result.deleteAt(proxy);
    else result.unset(proxy);
    db.edit("/spys/proxies", result);
  }
  return result;
}
