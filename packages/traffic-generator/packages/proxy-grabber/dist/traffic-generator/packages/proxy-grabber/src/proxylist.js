"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const curl_1 = require("./curl");
//https://proxy-list.org/english/search.php?search=ssl-no&country=any&type=any&port=any&ssl=any&p1-10
function proxyListOrg() {
    return bluebird_1.default.resolve((0, curl_1.get)('https://proxy-list.org/english/search.php?search=ssl-no&country=any&type=any&port=any&ssl=any&p1')).then((res) => {
        const data = res.data;
        const parser = (0, node_html_parser_1.default)(data.toString());
        const objectWrapper = [];
        parser.querySelectorAll('ul').map((ul) => {
            const buildObject = {
                proxy: null,
                code: null,
                anonymity: null,
                ssl: null,
                google: null,
                alert: null,
                type: 'http',
                test: null,
            };
            if (ul.innerHTML.includes("Proxy('")) {
                const li = ul.querySelectorAll('li');
                if (li) {
                    const proxy = li[0].rawText;
                    const extract = /Proxy\(['"](.*)['"]\)/gm.exec(proxy);
                    const decode = Buffer.from(extract[1], 'base64').toString('ascii');
                    buildObject.proxy = decode;
                    const type = li[1].rawText.trim().toLowerCase();
                    buildObject.ssl = type == 'https';
                    const anonymity = li[3].rawText.trim().toLowerCase();
                    switch (anonymity) {
                        case 'anonymous':
                            buildObject.anonymity = 'A';
                            break;
                        case 'transparent':
                            buildObject.anonymity = 'N';
                            break;
                        case 'elite':
                            buildObject.anonymity = 'H';
                            break;
                        default:
                            buildObject.anonymity = 'N';
                            break;
                    }
                    const location = li[4].querySelector('[class*=flag]');
                    buildObject.code = location.classList.toString().replace('flag', '').trim().toUpperCase();
                    objectWrapper.push(buildObject);
                }
            }
            return buildObject;
        });
        return objectWrapper;
    });
}
exports.default = proxyListOrg;
