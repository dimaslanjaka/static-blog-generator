"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const spys_1 = __importDefault(require("./spys"));
const moment_1 = __importDefault(require("moment"));
const sslproxies_1 = __importDefault(require("./sslproxies"));
const bluebird_1 = __importDefault(require("bluebird"));
const proxylist_1 = __importDefault(require("./proxylist"));
const curl_1 = __importDefault(require("./curl"));
require("../../../../hexo-seo/packages/js-prototypes/src/Array");
const db = new db_1.default('proxies');
class proxyGrabber {
    method1() {
        const lastUpdated = db.exists('/spys/lastUpdated') ? db.get('/spys/lastUpdated') : 100;
        // if spys last grab is more than 1 day
        if ((0, moment_1.default)().diff(lastUpdated, 'days') > 1) {
            return (0, spys_1.default)().then((proxies) => {
                db.push('/spys/lastUpdated', new Date());
                db.push('/spys/proxies', proxies);
                return proxies;
            });
        }
        return bluebird_1.default.resolve(db.get('/spys/proxies'));
    }
    method2() {
        const lastUpdated = db.exists('/sslProxiesOrg/lastUpdated') ? db.get('/sslProxiesOrg/lastUpdated') : 100;
        if ((0, moment_1.default)().diff(lastUpdated, 'days') > 1) {
            return (0, sslproxies_1.default)().then((proxies) => {
                db.push('/sslProxiesOrg/lastUpdated', new Date());
                db.push('/sslProxiesOrg/proxies', proxies);
                return proxies;
            });
        }
        return bluebird_1.default.resolve(db.get('/sslProxiesOrg/proxies'));
    }
    method3() {
        const lastUpdated = db.exists('/proxyListOrg/lastUpdated') ? db.get('/proxyListOrg/lastUpdated') : 100;
        if ((0, moment_1.default)().diff(lastUpdated, 'days') > 1) {
            return (0, proxylist_1.default)().then((proxies) => {
                db.push('/proxyListOrg/lastUpdated', new Date());
                db.push('/proxyListOrg/proxies', proxies);
                return proxies;
            });
        }
        return bluebird_1.default.resolve(db.get('/proxyListOrg/proxies'));
    }
    /**
     * Get all grabbed proxies
     * @returns
     */
    get() {
        //return Object.assign(this.method1(), this.method2());
        return this.method1().then((proxies) => {
            return this.method2().then((proxies2) => {
                return this.method3().then((proxies3) => {
                    return Object.assign(proxies, proxies2, proxies3);
                });
            });
        });
    }
    /**
     * Test all proxies
     * @param limit limit proxies to test (0=unlimited)
     */
    test(limit = 10) {
        this.get().then((proxies) => {
            proxies = proxies.uniqueObjectKey('proxy').shuffle();
            if (limit != 0)
                proxies.length = limit;
            const tests = proxies.map((obj) => {
                return curl_1.default
                    .testProxy(obj.proxy, 'https://httpbin.org/get', { HTTPHEADER: ['Accept: application/json'] })
                    .then((res) => {
                    //console.log({ proxy: obj.proxy, origin: res.data.origin });
                    if (res.statusCode == 200) {
                        if (res.data.origin == obj.proxy) {
                            obj.test = 'PASSED';
                        }
                        else {
                            obj.test = 'FAILED';
                        }
                        //db.push('/proxies', obj);
                        return obj;
                    }
                });
            });
        });
    }
    toString() {
        return JSON.stringify(this.get());
    }
}
exports.default = proxyGrabber;
