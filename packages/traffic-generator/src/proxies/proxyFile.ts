// Proxy.txt handler
// handling proxies line by line in text files

import { PathLike } from "fs";
import { readFile, writeFile } from "../../../hexo-seo/src/fm";
import "../../../hexo-seo/packages/js-prototypes/src/globals";
import path from "path";

export default class proxyFile {
  list: string[] = [];
  file: string;
  constructor(
    filepath: string | PathLike = path.join(
      process.cwd(),
      "databases/proxy.txt"
    )
  ) {
    this.file = filepath.toString();
    const read = readFile(filepath.toString()).toString();
    this.list = proxyFile.parseProxyFromText(read).shuffle();
  }
  /**
   * load from text
   * @param str
   * @returns
   */
  static fromText(str: string) {
    const parsed = proxyFile.parseProxyFromText(str);
    const init = new proxyFile();
    init.list = parsed;
    return init;
  }
  /**
   * Parse string from text
   * @param str
   * @returns
   */
  static parseProxyFromText(str: string) {
    const regex =
      /(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b):?(\d{2,5})/gm;
    let m: RegExpExecArray;
    const result: string[] = [];
    do {
      m = regex.exec(str);
      if (m) {
        result.push(m[0]);
      }
    } while (m);
    return result.unique().removeEmpties();
  }
  /**
   * get random proxy
   * @returns IP:PORT
   */
  random(): string {
    return this.list.random();
  }
  /**
   * Delete proxy
   * @param proxy
   */
  delete(proxy: string) {
    this.list.unset(proxy);
    writeFile(this.file, JSON.stringify(this.list));
  }
}
