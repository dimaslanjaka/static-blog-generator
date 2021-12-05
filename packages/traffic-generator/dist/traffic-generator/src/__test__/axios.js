"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.random = void 0;
/* eslint-disable import/extensions */
const axios_1 = __importDefault(require("axios"));
const spys_txt_1 = require("../../packages/proxy-grabber/src/parser/spys.txt");
const db_1 = __importDefault(require("../../packages/proxy-grabber/src/db"));
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
//import "../../../hexo-seo/packages/js-prototypes/src/Array";
require("../../../hexo-seo/packages/js-prototypes/src/globals");
const db = new db_1.default(path_1.default.join(process.cwd(), "databases/proxies"));
const instance = axios_1.default.create({
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
const result = [];
get.forEach((ret) => {
    result.push(ret.type + "://" + ret.proxy);
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
        db.edit("/spys/proxies", result);
    }
    return result;
}
exports.remove = remove;
//# sourceMappingURL=axios.js.map