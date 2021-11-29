"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_libcurl_1 = require("node-libcurl");
require("../../../../hexo-seo/packages/js-prototypes/src/Array");
const bluebird_1 = __importDefault(require("bluebird"));
/**
 * Grab Spys
 * @returns
 */
function spys() {
    return bluebird_1.default.resolve(node_libcurl_1.curly.get('http://spys.me/proxy.txt')).then((res) => {
        if (res.statusCode == 200) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const regex = /(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b):?(\d{2,5})/gm;
            const result = res.data
                .split('\n')
                .trim()
                .filter((str) => {
                if (!str.match(/^\d/)) {
                    return false;
                }
                return true;
            })
                .map((str) => {
                //IP address:Port CountryCode-Anonymity(Noa/Anm/Hia)-SSL_support(S)-Google_passed(+)
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
                // [ '79.104.25.218:8080', 'RU-H-S', '-' ]
                const parse = str.split(/\s/);
                buildObject.proxy = parse[0];
                // split country code and anonymity
                if (parse[1].includes('!')) {
                    buildObject.alert = true;
                    parse[1] = parse[1].replace('!', '');
                }
                else {
                    buildObject.alert = false;
                }
                const ctr = parse[1].split('-');
                buildObject.code = ctr[0];
                buildObject.anonymity = ctr[1];
                // if contains `S` is SSL
                if (typeof ctr[2] == 'string')
                    buildObject.ssl = true;
                if (parse[2] == '+') {
                    buildObject.google = true;
                }
                else {
                    buildObject.google = false;
                }
                return buildObject;
            });
            return result;
        }
    });
}
exports.default = spys;
