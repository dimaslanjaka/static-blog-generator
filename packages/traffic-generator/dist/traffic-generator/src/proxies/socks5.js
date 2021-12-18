"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socks5_json_1 = __importDefault(require("./socks5.json"));
require("../../../hexo-seo/packages/js-prototypes/src/Array");
const path_1 = __importDefault(require("path"));
const cleanup_1 = __importDefault(require("../../../hexo-seo/src/utils/cleanup"));
const fs_1 = require("fs");
class default_1 {
    constructor(winx) {
        this.file = path_1.default.join(__dirname, "socks5.json");
        this.win = winx;
    }
    getAllProxies() {
        const read = (0, fs_1.readFileSync)(this.file, "utf8").toString();
        const json = JSON.parse(read);
        return json;
    }
    getRandom() {
        //console.log(list);
        const r = socks5_json_1.default.random();
        return "socks5://" + r;
    }
    deleteProxy(prx) {
        const proxies = this.getAllProxies();
        console.log("proxy total before", proxies.length);
        proxies.unset(prx);
        const index = proxies.indexOf(prx);
        if (index > -1) {
            proxies.splice(index, 1);
        }
        console.log("proxy total after", socks5_json_1.default.length, proxies[prx]);
        const file = this.file;
        (0, cleanup_1.default)("proxy-socks5", function () {
            (0, fs_1.writeFileSync)(file, JSON.stringify(proxies));
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=socks5.js.map