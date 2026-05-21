import BasePreferences from './BasePreferences.js';
import { LocalStorage as NodeLocalStorage } from './LocalStorage.js';

// Polyfill for localStorage in Node.js using node-localstorage

declare let localStorage: Storage;
if (typeof localStorage === 'undefined' || localStorage === null) {
  // Only assign polyfill in Node.js
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    globalThis.localStorage = new NodeLocalStorage('./tmp/sbgUtilityLocalStorage') as any;
  }
}

/**
 * Implementation of SharedPreferences using localStorage.
 */
export class LocalStorageSharedPreferences implements BasePreferences {
  /**
   * Creates a new LocalStorageSharedPreferences instance.
   * @param namespace Namespace for all keys, similar to Android's SharedPreferences name. Required.
   */
  constructor(private readonly namespace: string) {
    if (!namespace) {
      throw new Error('Namespace is required for LocalStorageSharedPreferences');
    }
  }

  /**
   * Retrieves a string value for the given key.
   * @param key The key to look up.
   * @param defaultValue The value to return if the key is not found.
   */
  getString(key: string, defaultValue?: string): string | undefined {
    const value = localStorage.getItem(this.namespace + ':' + key);
    if (value === null || value === undefined) {
      return defaultValue;
    }
    return value;
  }

  /**
   * Stores a string value for the given key.
   * @param key The key to store.
   * @param value The string value to store.
   */
  putString(key: string, value: string): void {
    localStorage.setItem(this.namespace + ':' + key, value);
  }

  /**
   * Retrieves an integer value for the given key.
   * @param key The key to look up.
   * @param defaultValue The value to return if the key is not found.
   */
  getInt(key: string, defaultValue?: number): number | undefined {
    const value = localStorage.getItem(this.namespace + ':' + key);
    if (value === null || value === undefined) {
      return defaultValue;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Stores an integer value for the given key.
   * @param key The key to store.
   * @param value The integer value to store.
   */
  putInt(key: string, value: number): void {
    localStorage.setItem(this.namespace + ':' + key, value.toString());
  }

  /**
   * Retrieves a boolean value for the given key.
   * @param key The key to look up.
   * @param defaultValue The value to return if the key is not found.
   */
  getBoolean(key: string, defaultValue?: boolean): boolean | undefined {
    const value = localStorage.getItem(this.namespace + ':' + key);
    if (value === null || value === undefined) {
      return defaultValue;
    }
    if (value === 'true') return true;
    if (value === 'false') return false;
    return defaultValue;
  }

  /**
   * Stores a boolean value for the given key.
   * @param key The key to store.
   * @param value The boolean value to store.
   */
  putBoolean(key: string, value: boolean): void {
    localStorage.setItem(this.namespace + ':' + key, value ? 'true' : 'false');
  }

  /**
   * Removes the value for the given key.
   * @param key The key to remove.
   */
  remove(key: string): void {
    localStorage.removeItem(this.namespace + ':' + key);
  }

  /**
   * Clears all keys and values.
   */
  clear(): void {
    // Only remove keys with the namespace
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.namespace + ':')) {
        localStorage.removeItem(key);
      }
    }
  }
}

export default LocalStorageSharedPreferences;
