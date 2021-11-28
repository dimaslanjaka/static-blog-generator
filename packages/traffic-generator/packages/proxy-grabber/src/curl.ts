import Promise from 'bluebird';
import { curly, CurlyResult } from 'node-libcurl';
export function get(url: string): Promise<CurlyResult> {
  return Promise.resolve(curly.get(url)).then((res) => {
    if (res.statusCode == 301 || res.statusCode == 302) {
      return get(res.headers[0].Location);
    }
    return res;
  });
}
