import fs from 'fs-extra';
import path from 'upath';
import './JSON';
import { pathJoin, writefile } from './filemanager';

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
  memoryCache = {} as Record<string, any>;

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
  getSync<T>(name: string, fallback?: T): T {
    if (this.memory && !!this.memoryCache[name]) {
      const entry = this.memoryCache[name];

      if (entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
        // cache expired
        return fallback as T;
      }

      return JSON.parse(entry.data);
    }

    let data: ReturnType<typeof JSON.parse>;
    try {
      data = JSON.parse(fs.readFileSync(this.buildFilePath(name), 'utf8'));
    } catch (e) {
      return fallback as T;
    }

    if (data.cacheUntil && new Date().getTime() > data.cacheUntil) return fallback as T;

    return data.data;
  }

  get<T>(name: string, fallback?: T): Promise<T>;
  get<T>(name: string, fallback?: (e: Error | undefined | null, entry?: T) => any): void;
  get(name: string, fallback?: any) {
    if (typeof fallback !== 'function') {
      return new Promise((resolve) => {
        resolve(this.getSync(name, fallback));
      });
    } else {
      if (this.memory && !!this.memoryCache[name]) {
        let entry = this.memoryCache[name];

        if (!!entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
          return safeCb(fallback)(null, undefined);
        }

        try {
          entry = JSON.parse(entry.data);
        } catch (e) {
          return safeCb(fallback)(e);
        }

        return safeCb(fallback)(null, entry);
      }
      fs.readFile(this.buildFilePath(name), 'utf8', function (err: any, content: string) {
        if (err != null) {
          return safeCb(fallback)(null, undefined);
        }

        let entry: ReturnType<typeof JSON.parse>;
        try {
          entry = JSON.parse(content);
        } catch (e) {
          return safeCb(fallback)(e);
        }

        if (!!entry.cacheUntil && new Date().getTime() > entry.cacheUntil) {
          return safeCb(fallback)(null, undefined);
        }

        return safeCb(fallback)(null, entry.data);
      });
    }
  }

  /**
   * delete cache
   * @param name cache key
   * @param cb
   */
  deleteEntry(name: string, cb: fs.NoParamCallback) {
    if (this.memory) {
      delete this.memoryCache[name];

      if (!this.persist) safeCb(cb)(null);
    }

    fs.unlink(this.buildFilePath(name), cb);
  }

  /**
   * delete cache sync
   * @param name cache key
   * @returns
   */
  deleteEntrySync(name: string) {
    if (this.memory) {
      delete this.memoryCache[name];

      if (!this.persist) return;
    }

    fs.unlinkSync(this.buildFilePath(name));
  }

  getCacheDir() {
    return path.normalize(this.base + '/' + (this.name || 'cache'));
  }

  /**
   * remove current cache directory
   * @param cb
   * @returns
   */
  unlink(cb: { (e: Error, ...args: any[]): any; (e: Error, ...args: any[]): any }) {
    if (this.persist) {
      if (typeof cb !== 'function') {
        return fs.rmSync(this.getCacheDir(), { recursive: true, force: true });
      } else {
        return fs.rm(this.getCacheDir(), { recursive: true, force: true }, safeCb(cb));
      }
    }

    safeCb(cb)(null);
  }

  private transformFileNameToKey(fileName: string) {
    return fileName.slice(0, -5);
  }

  /**
   * get all cache keys
   * @param cb
   * @returns
   */
  keys(cb: (e: Error | null, ...args: any[]) => any) {
    const self = this;
    cb = safeCb(cb);

    if (this.memory && !this.persist) return cb(null, Object.keys(this.memoryCache));

    fs.readdir(this.getCacheDir(), function (err, files) {
      return err ? cb(err) : cb(err, files.map(self.transformFileNameToKey));
    });
  }

  /**
   * get cache keys sync
   * @returns
   */
  keysSync() {
    const self = this;
    if (this.memory && !this.persist) return Object.keys(this.memoryCache);
    if (fs.existsSync(this.getCacheDir())) {
      return fs.readdirSync(this.getCacheDir()).map(self.transformFileNameToKey);
    } else {
      return [];
    }
  }

  /**
   * get all values
   * @returns
   */
  valuesSync() {
    return this.keysSync().map((key) => {
      return this.getSync(key);
    });
  }

  buildFilePath(name: string) {
    return path.normalize(this.getCacheDir() + '/' + name + '.json');
  }

  buildCacheEntry(data: any) {
    const cacheInfinitely = !(typeof this.duration === 'number');
    return {
      cacheUntil: !cacheInfinitely ? new Date().getTime() + this.duration : undefined,
      data: data
    };
  }
}

type safeCbParam =
  | null
  | undefined
  | {
      (e: Error, ...args: any[]): any;
      (...args: any[]): any;
    };

/**
 * safe callback
 * @param cb
 * @returns
 */
export function safeCb(cb: safeCbParam): (...args: any[]) => any {
  if (typeof cb === 'function') return cb;

  return function () {
    //
  };
}
