"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const jsdom_1 = require("jsdom");
const node_libcurl_1 = require("node-libcurl");
const path_1 = __importDefault(require("path"));
const url = "https://www.sslproxies.org/";
async function get(url) {
    const { statusCode, data, headers } = await node_libcurl_1.curly.get(url);
    return data;
}
const jsonFile = path_1.default.join(__dirname, "data/sslproxies.json");
if (!(0, fs_1.existsSync)(path_1.default.dirname(jsonFile))) {
    (0, fs_1.mkdirSync)(path_1.default.dirname(jsonFile), { recursive: true });
}
get(url).then((response) => {
    const proxies = [];
    const dom = new jsdom_1.JSDOM(response);
    const document = dom.window.document;
    const tr = document.querySelectorAll("tbody tr");
    tr.forEach((node) => {
        const td = node.querySelectorAll("td");
        const text = td[0].textContent + ":" + td[1].textContent;
        if (/^\d/g.test(text) && text.length > 2) {
            proxies.push(text);
        }
    });
    (0, fs_1.writeFileSync)(jsonFile, JSON.stringify(proxies));
});
//# sourceMappingURL=sslproxies.org.js.map