"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testProxy = exports.get = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
var bluebird_1 = __importDefault(require("bluebird"));
var node_libcurl_1 = require("node-libcurl");
function get(url, options) {
    return bluebird_1.default.resolve(node_libcurl_1.curly.get(url, options || {
        USERAGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        FOLLOWLOCATION: true,
        REFERER: 'http://google.com/crawler',
    })).then(function (res) {
        if (res.statusCode == 301 || res.statusCode == 302) {
            return get(res.headers[0].Location);
        }
        return res;
    });
}
exports.get = get;
function testProxy(proxy, target, options) {
    if (target === void 0) { target = 'http://google.com'; }
    var def = {
        USERAGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        FOLLOWLOCATION: true,
        REFERER: 'https://webmanajemen.com',
        httpProxyTunnel: '1L',
        PROXY: proxy,
    };
    if (typeof options == 'object') {
        for (var key in options) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                var element = options[key];
                def[key] = element;
            }
        }
    }
    return get(target, def);
}
exports.testProxy = testProxy;
exports.default = {
    testProxy: testProxy,
    curlGET: get,
};
