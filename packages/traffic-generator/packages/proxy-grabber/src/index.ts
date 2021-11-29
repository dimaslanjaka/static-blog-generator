/* global dbFolder */
import dbl from './db';
import spys, { returnObj } from './spys';
import moment from 'moment';
import sslProxiesOrg from './sslproxies';
import Promise from 'bluebird';
import proxyListOrg from './proxylist';
import path from 'path';
import curl from './curl';
import '../../../../hexo-seo/packages/js-prototypes/src/Array';
declare const dbFolder: string;
const db = new dbl(path.join(dbFolder, 'databases/proxies'));

class proxyGrabber {
  method1(): Promise<returnObj[]> {
    const lastUpdated = db.exists('/spys/lastUpdated') ? db.get('/spys/lastUpdated') : 100;
    // if spys last grab is more than 1 day
    if (moment().diff(lastUpdated, 'days') > 1) {
      return spys().then((proxies) => {
        db.push('/spys/lastUpdated', new Date());
        db.push('/spys/proxies', proxies);
        return proxies;
      });
    }
    return Promise.resolve(db.get('/spys/proxies'));
  }

  method2(): Promise<returnObj[]> {
    const lastUpdated = db.exists('/sslProxiesOrg/lastUpdated') ? db.get('/sslProxiesOrg/lastUpdated') : 100;
    if (moment().diff(lastUpdated, 'days') > 1) {
      return sslProxiesOrg().then((proxies) => {
        db.push('/sslProxiesOrg/lastUpdated', new Date());
        db.push('/sslProxiesOrg/proxies', proxies);
        return proxies;
      });
    }
    return Promise.resolve(db.get('/sslProxiesOrg/proxies'));
  }

  method3(): Promise<returnObj[]> {
    const lastUpdated = db.exists('/proxyListOrg/lastUpdated') ? db.get('/proxyListOrg/lastUpdated') : 100;
    if (moment().diff(lastUpdated, 'days') > 1) {
      return proxyListOrg().then((proxies) => {
        db.push('/proxyListOrg/lastUpdated', new Date());
        db.push('/proxyListOrg/proxies', proxies);
        return proxies;
      });
    }
    return Promise.resolve(db.get('/proxyListOrg/proxies'));
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
   * @param limit limit proxies each instance to test (0=unlimited)
   */
  test(limit = 10) {
    function testProxies(proxies: returnObj[], dbKey: string) {
      return Promise.resolve(proxies).map((obj) => {
        const result: TestResult = { error: true, proxy: null, message: null, code: 0 };
        return curl
          .testProxy(obj.proxy, 'https://httpbin.org/get', { HTTPHEADER: ['Accept: application/json'] })
          .then((res) => {
            //console.log({ proxy: obj.proxy, origin: res.data.origin });
            /*if (res.statusCode == 200) {
            if (res.data.origin == obj.proxy) {
              obj.test = 'PASSED';
            } else {
              obj.test = 'FAILED';
            }
            db.edit(dbKey, obj, { proxy: obj.proxy });
            return { error: false, proxy: obj };
          } */
            result.error = res.statusCode != 200;
            result.proxy = obj;
            obj.test = !result.error ? 'PASSED' : 'FAILED';
            db.edit(dbKey, obj, { proxy: obj.proxy });
            return result;
          })
          .catch((e: Error) => {
            result.error = true;
            result.proxy = obj;
            result.message = e.message;
            result.code = e['code'] as number;
            return result;
          });
      });
    }
    return [this.method1(), this.method2(), this.method3()].map((obj, index) => {
      let dbKey: string;
      switch (index) {
        case 0:
          dbKey = '/spys/proxies';
          break;
        case 1:
          dbKey = '/sslProxiesOrg/proxies';
          break;
        case 2:
          dbKey = '/proxyListOrg/proxies';
          break;
      }
      if (dbKey) {
        return obj.then((proxies) => {
          proxies = proxies.uniqueObjectKey('proxy').shuffle();
          if (limit != 0) proxies.length = limit;
          return testProxies(proxies, dbKey);
        });
      }
      return { error: true, proxy: null, message: 'cannot find database key', code: 99 };
    });
  }

  toString() {
    return JSON.stringify(this.get());
  }
}

interface TestResult {
  error: boolean;
  proxy: returnObj;
  message?: string;
  code?: number;
}

export = proxyGrabber;
