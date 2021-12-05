"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const sslproxies_json_1 = __importDefault(require("../__test__/data/sslproxies.json"));
const https_json_1 = __importDefault(require("./https.json"));
require("../../../hexo-seo/packages/js-prototypes/src/Array");
const cleanup_1 = __importDefault(require("../../../hexo-seo/src/utils/cleanup"));
let list = [];
class default_1 {
    constructor(winx) {
        this.file = path_1.default.join(__dirname, "../__test__/data/sslproxies.json");
        this.win = winx;
        list = list.concat(this.concatProxies());
    }
    concatProxies() {
        const fileProxies = [
            path_1.default.join(__dirname, "../__test__/data/sslproxies.json"),
            path_1.default.join(__dirname, "./https.json")
        ];
        fileProxies.map((file) => {
            const read = (0, fs_1.readFileSync)(file, "utf8").toString();
            try {
                const json = JSON.parse(read);
                if (Array.isArray(json)) {
                    list = list.concat(json).unique().shuffle();
                }
            }
            catch (error) {
                return;
            }
        });
        return list;
    }
    fold() {
        return https_json_1.default.concat(sslproxies_json_1.default);
    }
    getAllProxies() {
        return this.concatProxies();
    }
    getRandom() {
        //console.log(list);
        const r = list.random();
        return "http://" + r;
    }
    deleteProxy(prx) {
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
        (0, cleanup_1.default)("proxy-https", function () {
            (0, fs_1.writeFileSync)(file, JSON.stringify(proxies));
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=https.js.map