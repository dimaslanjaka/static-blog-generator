/* eslint-disable @typescript-eslint/no-empty-function */
import Promise from 'bluebird';
import { curly, CurlyResult } from 'node-libcurl';
import { CurlyOptions } from 'node-libcurl/dist/curly';
export function get(url: string, options?: CurlyOptions): Promise<CurlyResult> {
  return Promise.resolve(
    curly.get(
      url,
      options || {
        USERAGENT:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        FOLLOWLOCATION: true,
        REFERER: 'http://google.com/crawler',
      },
    ),
  ).then((res) => {
    if (res.statusCode == 301 || res.statusCode == 302) {
      return get(res.headers[0].Location);
    }
    return res;
  });
}

export function testProxy(proxy: string, target = 'http://google.com', options?: CurlyOptions) {
  const def: CurlyOptions = {
    USERAGENT:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    FOLLOWLOCATION: true,
    REFERER: 'https://webmanajemen.com',
    httpProxyTunnel: '1L',
    PROXY: proxy,
  };
  if (typeof options == 'object') {
    for (const key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        const element = options[key];
        def[key] = element;
      }
    }
  }
  return get(target, def);
}

export default {
  testProxy,
  curlGET: get,
};
