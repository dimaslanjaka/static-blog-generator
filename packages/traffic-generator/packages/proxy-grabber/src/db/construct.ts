import path from 'path';
import * as fm from '../../../../../hexo-seo/src/fm';
import '../../../../../hexo-seo/packages/js-prototypes/src/Number';
import { existsSync } from 'fs';

class DBConstructor {
  folder: string;
  /**
   * Database File Constructor
   * @param folder folder to save entire databases
   */
  constructor(folder: string) {
    this.folder = folder;
  }
  /**
   * check if data key on table exists
   * @param key
   * @returns
   */
  exists(key: string) {
    return existsSync(this.locationfile(key));
  }
  /**
   * add data to table
   * @param key
   * @param value
   */
  push(key: string, value: any) {
    let content: string;
    content = typeof value + ':' + Buffer.from(value.toString()).toString('base64');
    if (Array.isArray(value) || typeof value == 'object') {
      content = typeof value + ':' + Buffer.from(JSON.stringify(value)).toString('base64');
    } else if (typeof value == 'number') {
      if (isInt(value)) {
        content = 'number:' + Buffer.from(value.toString()).toString('base64');
      } else if (isFloat(value)) {
        content = 'float:' + Buffer.from(value.toString()).toString('base64');
      }
    }

    fm.writeFile(this.locationfile(key), content);
  }

  /**
   * get table database by key
   * @param key key table
   * @param fallback fallback value if not exists
   * @returns
   * @example
   * const nonExists = db.exists('/data-not-exists', 'default value');
   * console.log(nonExists); // default value
   */
  get<T>(
    key: string,
    fallback?: T,
  ): null | T | string | ReturnType<typeof JSON.parse> | ReturnType<typeof parseInt> | ReturnType<typeof parseFloat> {
    const ada = this.exists(key);
    if (!ada) {
      if (fallback) return fallback;
      return null;
    }
    const content = fm.readFile(this.locationfile(key)).toString().split(':');
    const value = Buffer.from(content[1], 'base64').toString('ascii');
    switch (content[0]) {
      case 'object' || 'array':
        return JSON.parse(value);
      case 'float':
        return parseFloat(value);
      case 'number':
        return parseInt(value);
      default:
        return value;
    }
  }
  private locationfile(key: string) {
    return path.join(this.folder, key);
  }
}

export default DBConstructor;
