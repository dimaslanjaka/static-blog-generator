import dbl from './db';
import spys, { returnObj } from './spys';
import moment from 'moment';
import sslProxiesOrg from './sslproxies';
import Promise from 'bluebird';
import proxyListOrg from './proxylist';
const db = dbl('proxies');

class proxyGrabber {
  method1(): Promise<returnObj[]> {
    const spysLastUpdated = db.getData('/spys/lastUpdated');
    // if spys last grab is more than 1 day
    if (moment().diff(spysLastUpdated, 'days') > 1) {
      return spys().then((proxies) => {
        db.push('/spys/lastUpdated', new Date());
        db.push('/spys/proxies', proxies);
        return proxies;
      });
    }
    return Promise.resolve(db.getData('/spys/proxies'));
  }

  method2(): Promise<returnObj[]> {
    const spysLastUpdated = db.getData('/sslProxiesOrg/lastUpdated');
    if (moment().diff(spysLastUpdated, 'days') > 1) {
      return sslProxiesOrg().then((proxies) => {
        db.push('/sslProxiesOrg/lastUpdated', new Date());
        db.push('/sslProxiesOrg/proxies', proxies);
        return proxies;
      });
    }
    return Promise.resolve(db.getData('/sslProxiesOrg/proxies'));
  }

  method3() {
    proxyListOrg();
  }

  /**
   * Get all grabbed proxies
   * @returns
   */
  get() {
    //return Object.assign(this.method1(), this.method2());
    return this.method1().then((proxies) => {
      return this.method2().then((proxies2) => {
        return Object.assign(proxies, proxies2);
      });
    });
  }

  toString() {
    return JSON.stringify(this.get());
  }
}

export default proxyGrabber;
