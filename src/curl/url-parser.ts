import { deepmerge } from 'deepmerge-ts';
import { basename } from 'upath';
import urlParse from 'url-parse';
import { removeEmpties } from '../node/array-utils';
import { DeepPartial } from '../parser/post/postMapper';

/** URL Parsed Result */
export interface URLParsed extends DeepPartial<ReturnType<typeof urlParse>> {
  /** hostname/domain/ip:port */
  host: string;
  /** hostname/domain/ip */
  hostname: string;
  /** query string */
  search: string;
  /** query string object parsed */
  searchObject: Record<string, any>;
  /** protocol://host */
  protohost: string;
  /** filename from url */
  filename: string;
}

/**
 * Automatically parse url with the query strings to object (nullable)
 * @param src url string
 * @returns object parsed {@link URLParsed} combined with partial properties from {@link urlParse}
 */
export default class urlParser {
  result: ReturnType<urlParser['parse']>;
  resultStr: string;
  constructor(src: string) {
    this.result = this.parse(src);
  }
  parse(src: string) {
    if (!src) return;
    this.resultStr = src;
    const parser = new urlParse(src);
    const searchObject: Array<Record<any, any> | any> = [];
    const queries: string[] = parser.query.replace(/^\?/, '').split('&');
    let split: Array<Record<any, any> | any> = [];
    for (let i = 0; i < queries.length; i++) {
      split = removeEmpties(queries[i].split('='));
      if (0 in split) {
        searchObject[split[0]] = split[1];
      }
    }
    const parsed = {
      protocol: parser.protocol,
      host: parser.host,
      hostname: parser.hostname,
      port: parser.port,
      pathname: parser.pathname,
      hash: parser.hash,
      protohost: parser.protocol + '//' + parser.host,
      search: parser.query,
      searchObject: searchObject,
      filename: basename(parser.pathname)
    };
    return deepmerge(parsed, parser) as URLParsed;
  }
  toString() {
    return this.resultStr;
  }
}
