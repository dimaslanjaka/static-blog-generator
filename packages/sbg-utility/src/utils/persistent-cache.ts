import fs from 'fs-extra';
import path from 'upath';
import { pathJoin, writefile } from './filemanager';
import './JSON';

export interface PersistentCacheOpt {
  // [key: string]: any;
  /**
   * folder cache
   * @description The base directory where `persistent-cache` will save its caches.
   *
   * Defaults to the main modules directory
   */
  base: string;
  /**
   * cache instance name
   * @description The name of the cache. Determines the name of the created folder where the data is stored, which is just `base + name`.
   *
   * Defaults to `cache`
   */
  name: string;
  /**
   * expired in milliseconds
   * @description The amount of milliseconds a cache entry should be valid for. If not set, cache entries are not invalidated (stay until deleted).
   *
   * Defaults to `undefined` (infinite)
   */
  duration: number;
  /**
   * Whether the cache should use memory caching or not (mirrors all cache data in the ram,
   * saving disk I/O and increasing performance).
   *
   * Defaults to `true`
   */
  memory: boolean;
  /**
   * Whether the cache should be persistent, aka if it should write its data to the disk
   * for later use or not. Set this to `false` to create a memory-only cache.
   *
   * Defaults to `true`
   */
  persist: boolean;
}

export class persistentCache implements PersistentCacheOpt {
  base: string;
  name: string;
  duration: number;
  memory: boolean;
  persist: boolean;
  memoryCache = {};
  constructor(options: Partial<PersistentCacheOpt> = {}) {
    this.base =
      options.base ||
      pathJoin((require.main ? path.dirname(require.main.filename) : undefined) || process.cwd(), 'tmp');
    this.name = options.name || 'cache';
    this.persist = typeof options.persist == 'boolean' ? options.persist : true;
    this.memory = typeof options.memory == 'boolean' ? options.memory : true;
    this.duration = options.duration || Infinity;
  }

  /**
   * add cache deferred callback
   * @param key
   * @param data
   * @param cb
   * @returns
   */
  put(
    key: string,
    data: any,
    cb:
      | {
          (e: Error | NodeJS.ErrnoException): any;
          (e: Error | NodeJS.ErrnoException, ...args: any[]): any;
        }
      | null
      | undefined
  ) {
    const put = this.putSync(key, data);
    if (put === true) {
      return safeCb(cb)(null);
    } else {
      safeCb(cb)(put);
    }
  }

  /**
   * add cache sync
   * @param key
   * @param data
   * @returns boolean=success, any=error
   */
  putSync(key: string, data: any): any | boolean {
    const entry = this.buildCacheEntry(data);

    if (this.persist) {
      // save in file
      try {
        writefile(this.buildFilePath(key), JSON.stringifyWithCircularRefs(entry));
      } catch (e) {
        return e;
      }
    }

    if (this.memory) {
      // save in memory only
      entry.data = JSON.stringifyWithCircularRefs(entry.data);

      this.memoryCache[key] = entry;
    }

    return true;
  }

  setSync = this.putSync;

  /**
   * add cache async
   * @param key
   * @param data
   * @returns
   */
  set(key: string, data: any) {
    return new Promise((resolve, reject) => {
      this.put(key, data, function (e: any) {
        if (!e) {
          resolve(true);
        } else {
          reject(e);
        }
      });
    });
  }

  /**
   * get cache by key synchronously
   * @param name
   * @param fallback
   * @returns
   */
  getSync<T = string>(name: string, fallback?: T): T {
    if (this.memory && !!this.memoryCache[name]) {
      const entry = this.memoryCache[name];

      if (entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
        return undefined;
      }

      return JSON.parse(entry.data);
    }

    let data: ReturnType<typeof JSON.parse>;
    try {
      data = JSON.parse(fs.readFileSync(this.buildFilePath(name), 'utf8'));
    } catch (e) {
      return fallback;
    }

    if (data.cacheUntil && new Date().getTime() > data.cacheUntil) return fallback;

    return data.data;
  }

  buildFilePath(name: string) {
    const cacheDir = path.normalize(this.base + '/' + (this.name || 'cache'));
    return path.normalize(cacheDir + '/' + name + '.json');
  }

  buildCacheEntry(data: any) {
    const cacheInfinitely = !(typeof this.duration === 'number');
    return {
      cacheUntil: !cacheInfinitely ? new Date().getTime() + this.duration : undefined,
      data: data
    };
  }
}

/**
 * safe callback
 * @param cb
 * @returns
 */
export function safeCb(cb: { (e: Error, ...args: any[]): any }): (...args: any[]) => any {
  if (typeof cb === 'function') return cb;

  return function () {
    //
  };
}
