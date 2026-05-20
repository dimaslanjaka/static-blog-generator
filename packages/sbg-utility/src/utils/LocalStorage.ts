import path from 'path';
import fs from 'fs';
import { EventEmitter } from 'events';
import { sync as writeSync } from 'write-file-atomic';
import { Nullable } from '../globals.js';

const KEY_FOR_EMPTY_STRING = '---.EMPTY_STRING.---'; // Chose something that no one is likely to ever use

function _emptyDirectory(target: string): void {
  const files = fs.readdirSync(target);
  for (const p of files) {
    _rm(path.join(target, p));
  }
}

function _rm(target: string): void {
  if (fs.statSync(target).isDirectory()) {
    _emptyDirectory(target);
    fs.rmdirSync(target);
  } else {
    fs.unlinkSync(target);
  }
}

function _escapeKey(key: string | number): string {
  if (String(key) === '') {
    return KEY_FOR_EMPTY_STRING;
  } else {
    return `${key}`;
  }
}

class QUOTA_EXCEEDED_ERR extends Error {
  constructor(message: string = 'Unknown error.') {
    super(message);
    this.name = 'QUOTA_EXCEEDED_ERR';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }
}

class StorageEvent {
  constructor(
    public key: string | null,
    public oldValue: string | null,
    public newValue: string | null,
    public url: string,
    public storageArea: string = 'localStorage'
  ) {}
}

class MetaKey {
  // MetaKey contains key and size
  size?: number;
  constructor(
    public key: string,
    public index: number
  ) {}
}

function createMap(): Record<string, MetaKey> {
  // createMap contains Metakeys as properties
  const Map = function () {};
  Map.prototype = Object.create(null);
  return new (Map as any)();
}

class LocalStorage extends EventEmitter {
  private static instanceMap: Record<string, any> = {};

  length: number = 0;
  private _location: string;
  private _quota: number;
  private _bytesInUse: number = 0;
  private _keys: string[] = [];
  private _metaKeyMap: Record<string, MetaKey> = createMap();
  private _eventUrl!: string;
  private readonly _QUOTA_EXCEEDED_ERR: typeof QUOTA_EXCEEDED_ERR = QUOTA_EXCEEDED_ERR;

  constructor(_location: string = './tmp/sbgUtilityLocalStorage', quota: number = 5 * 1024 * 1024) {
    super();
    this._location = path.resolve(_location);
    this._quota = quota;

    if (!(this instanceof LocalStorage)) {
      return new LocalStorage(_location, quota) as any;
    }

    if (LocalStorage.instanceMap[this._location]) {
      return LocalStorage.instanceMap[this._location];
    }

    this._eventUrl = 'pid:' + process.pid;
    this._init();
    const self = this;

    if (typeof Proxy !== 'undefined') {
      const handler = {
        set: (_receiver: any, key: string, value: any): boolean => {
          if (this[key] !== undefined) {
            this[key] = value;
          } else {
            this.setItem(key, value);
          }
          return true;
        },

        get: (_receiver: any, key: string): any => {
          if (this[key] !== undefined) {
            return this[key];
          } else {
            return this.getItem(key);
          }
        },

        ownKeys: (_target: any): string[] => {
          return this._keys.map((k) => {
            if (k === KEY_FOR_EMPTY_STRING) {
              return '';
            } else {
              return k;
            }
          });
        },

        getOwnPropertyDescriptor: (_target: any, key: string): PropertyDescriptor | undefined => {
          return {
            value: this[key],
            enumerable: true,
            configurable: true
          };
        }
      };

      LocalStorage.instanceMap[self._location] = new Proxy(self, handler);
      return LocalStorage.instanceMap[this._location];
    }

    // else it'll return this
    LocalStorage.instanceMap[self._location] = self;
    return self;
  }

  private _init(): void {
    try {
      const stat = fs.statSync(this._location);
      if (stat && !stat.isDirectory()) {
        throw new Error(`A file exists at the location '${this._location}' when trying to create/open localStorage`);
      }
      // At this point, it exists and is definitely a directory. So read it.
      this._sync();
      return;
    } catch (e) {
      // If it errors, that might mean it didn't exist, so try to create it
      if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw e;
      }
      try {
        fs.mkdirSync(this._location, { recursive: true });
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
          throw err;
        }
      }
      return;
    }
  }

  private _sync(): void {
    this._bytesInUse = 0;
    this.length = 0;
    const _keys = fs.readdirSync(this._location);
    for (let index = 0; index < _keys.length; index++) {
      const k = _keys[index];
      const _decodedKey = decodeURIComponent(k);
      this._keys.push(_decodedKey);
      const _MetaKey = new MetaKey(k, index);
      this._metaKeyMap[_decodedKey] = _MetaKey;
      const stat = this._getStat(k);
      if (stat?.size !== undefined) {
        _MetaKey.size = stat.size;
        this._bytesInUse += stat.size;
      }
    }
    this.length = _keys.length;
  }

  setItem(key: Nullable<string | number>, value: any): void {
    const hasListeners = this.listenerCount('storage') > 0;
    let oldValue: string | null = null;
    if (hasListeners) {
      oldValue = this.getItem(String(key));
    }
    key = _escapeKey(String(key));
    const encodedKey = encodeURIComponent(key)
      .replace(/[!'()]/g, escape)
      .replace(/\*/g, '%2A');

    const filename = path.join(this._location, encodedKey);
    const valueString = `${value}`;
    const valueStringLength = valueString.length;
    const existsBeforeSet = Object.prototype.hasOwnProperty.call(this._metaKeyMap, key);
    const oldLength = existsBeforeSet ? this._metaKeyMap[key].size || 0 : 0;

    if (this._bytesInUse - oldLength + valueStringLength > this._quota) {
      throw new this._QUOTA_EXCEEDED_ERR();
    }

    writeSync(filename, valueString, { encoding: 'utf8' });

    if (!existsBeforeSet) {
      const newMetaKey = new MetaKey(encodedKey, this._keys.push(key) - 1);
      newMetaKey.size = valueStringLength;
      this._metaKeyMap[key] = newMetaKey;
      this.length += 1;
      this._bytesInUse += valueStringLength;
    } else {
      this._metaKeyMap[key].size = valueStringLength;
    }

    if (hasListeners) {
      const evnt = new StorageEvent(key, oldValue, value, this._eventUrl);
      this.emit('storage', evnt);
    }
  }

  getItem(key: Nullable<string | number>): string | null {
    key = _escapeKey(String(key));
    const metaKey = this._metaKeyMap[key];
    if (metaKey) {
      const filename = path.join(this._location, metaKey.key);
      return fs.readFileSync(filename, 'utf8');
    } else {
      return null;
    }
  }

  private _getStat(key: string): fs.Stats | null {
    key = _escapeKey(key);
    const filename = path.join(this._location, encodeURIComponent(key));
    try {
      return fs.statSync(filename);
    } catch {
      return null;
    }
  }

  removeItem(key: Nullable<string | number>): void {
    key = _escapeKey(String(key));
    const metaKey = this._metaKeyMap[key];
    if (metaKey) {
      const hasListeners = this.listenerCount('storage') > 0;
      let oldValue: string | null = null;
      if (hasListeners) {
        oldValue = this.getItem(key);
      }
      delete this._metaKeyMap[key];
      this.length -= 1;
      this._bytesInUse -= metaKey.size || 0;
      const filename = path.join(this._location, metaKey.key);
      this._keys.splice(metaKey.index, 1);
      for (const k in this._metaKeyMap) {
        if (Object.prototype.hasOwnProperty.call(this._metaKeyMap, k)) {
          const meta = this._metaKeyMap[k];
          if (meta.index > metaKey.index) {
            meta.index -= 1;
          }
        }
      }
      _rm(filename);
      if (hasListeners) {
        const evnt = new StorageEvent(key, oldValue, null, this._eventUrl);
        this.emit('storage', evnt);
      }
    }
  }

  key(n: number): string | null {
    const rawKey = this._keys[n];
    if (rawKey === KEY_FOR_EMPTY_STRING) {
      return '';
    } else {
      return rawKey !== undefined ? rawKey : null;
    }
  }

  clear(): void {
    _emptyDirectory(this._location);
    this._metaKeyMap = createMap();
    this._keys = [];
    this.length = 0;
    this._bytesInUse = 0;
    if (this.listenerCount('storage') > 0) {
      const evnt = new StorageEvent(null, null, null, this._eventUrl);
      this.emit('storage', evnt);
    }
  }

  _getBytesInUse(): number {
    return this._bytesInUse;
  }

  _deleteLocation(): void {
    delete LocalStorage.instanceMap[this._location];
    _rm(this._location);
    this._metaKeyMap = {};
    this._keys = [];
    this.length = 0;
    this._bytesInUse = 0;
  }
}

class JSONStorage extends LocalStorage {
  setItem(key: string, value: any): void {
    const newValue = JSON.stringify(value);
    super.setItem(key, newValue);
  }

  getItem(key: string): any {
    const item = super.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }
}

export { LocalStorage, JSONStorage, QUOTA_EXCEEDED_ERR };
