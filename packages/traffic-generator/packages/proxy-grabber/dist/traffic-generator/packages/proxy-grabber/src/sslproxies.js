"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const curl_1 = require("./curl");
function sslProxiesOrg() {
    return bluebird_1.default.resolve((0, curl_1.get)('http://www.sslproxies.org')).then((res) => {
        const data = res.data;
        const regex = /[0-9]{1,4}.[0-9]{1,4}.[0-9]{1,4}.[0-9]{1,4}/gm;
        const regex2 = /[0-9]{1,4}.[0-9]{1,4}.[0-9]{1,4}.[0-9]{1,4}:[0-9]{1,5}/gm;
        const parser = (0, node_html_parser_1.default)(data.toString());
        const objectWrapper = [];
        parser.querySelectorAll('table').map((el) => {
            el.querySelectorAll('tr').map((tr) => {
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
                const td = tr.querySelectorAll('td');
                const proxy = td[0];
                const port = td[1];
                const countryCode = td[2];
                const anonymity = td[4];
                const google = td[5];
                const ssl = td[6];
                if (proxy && /^\d/.test(proxy.rawText)) {
                    //console.log(proxy.rawText, port.rawText, countryCode.rawText, anonymity.rawText, google.rawText, ssl.rawText);
                    buildObject.proxy = `${proxy.rawText.trim()}:${port.rawText.trim()}`;
                    buildObject.google = /^yes/.test(google.rawText.trim()) ? true : false;
                    buildObject.ssl = /^yes/.test(ssl.rawText.trim()) ? true : false;
                    buildObject.code = countryCode.rawText.trim();
                    switch (anonymity.rawText.trim()) {
                        case 'elite proxy':
                            buildObject.anonymity = 'H';
                            break;
                        case 'anonymous':
                            buildObject.anonymity = 'A';
                            break;
                        default:
                            buildObject.anonymity = 'N';
                            break;
                    }
                    objectWrapper.push(buildObject);
                }
            });
        });
        return objectWrapper;
    });
}
exports.default = sslProxiesOrg;
