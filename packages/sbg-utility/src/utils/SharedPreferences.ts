import BasePreferences from './BasePreferences.js';
import { LocalStorageSharedPreferences } from './LocalStorageSharedPreferences.js';
import MemorySharedPreferences from './MemorySharedPreferences.js';

export type SharedPreferencesOptions = { namespace: string; type: 'localStorage' | 'memory' };

export default class SharedPreferences implements BasePreferences {
  store!: BasePreferences;
  constructor(options?: Partial<SharedPreferencesOptions>) {
    const defaults: SharedPreferencesOptions = { namespace: 'default', type: 'localStorage' };
    const mergedOptions: SharedPreferencesOptions = { ...defaults, ...options };
    if (mergedOptions.type === 'localStorage') {
      this.store = new LocalStorageSharedPreferences(mergedOptions.namespace);
    } else if (mergedOptions.type === 'memory') {
      this.store = new MemorySharedPreferences(mergedOptions.namespace);
    } else {
      throw new Error('Unsupported SharedPreferences type: ' + mergedOptions.type);
    }
  }

  getString(key: string, defaultValue?: string): string | undefined {
    return this.store.getString(key, defaultValue);
  }

  putString(key: string, value: string): void {
    this.store.putString(key, value);
  }

  getInt(key: string, defaultValue?: number): number | undefined {
    return this.store.getInt(key, defaultValue);
  }

  putInt(key: string, value: number): void {
    this.store.putInt(key, value);
  }

  getBoolean(key: string, defaultValue?: boolean): boolean | undefined {
    return this.store.getBoolean(key, defaultValue);
  }

  putBoolean(key: string, value: boolean): void {
    this.store.putBoolean(key, value);
  }

  remove(key: string): void {
    this.store.remove(key);
  }

  clear(): void {
    this.store.clear();
  }
}
