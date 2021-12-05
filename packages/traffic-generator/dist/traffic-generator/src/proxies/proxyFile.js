"use strict";
// Proxy.txt handler
// handling proxies line by line in text files
Object.defineProperty(exports, "__esModule", { value: true });
const fm_1 = require("../../../hexo-seo/src/fm");
require("../../../hexo-seo/packages/js-prototypes/src/globals");
class proxyFile {
    constructor(filepath) {
        this.list = [];
        this.file = filepath.toString();
        const read = (0, fm_1.readFile)(filepath.toString()).toString();
        this.list = proxyFile.parseProxyFromText(read).shuffle();
    }
    /**
     * Parse string from text
     * @param str
     * @returns
     */
    static parseProxyFromText(str) {
        const regex = /(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b):?(\d{2,5})/gm;
        let m;
        const result = [];
        do {
            m = regex.exec(str);
            if (m) {
                result.push(m[0]);
            }
        } while (m);
        return result;
    }
    /**
     * get random proxy
     * @returns IP:PORT
     */
    random() {
        return this.list.random();
    }
    /**
     * Delete proxy
     * @param proxy
     */
    delete(proxy) {
        this.list.unset(proxy);
        (0, fm_1.writeFile)(this.file, JSON.stringify(this.list));
    }
}
exports.default = proxyFile;
//# sourceMappingURL=proxyFile.js.map