import BasePreferences from './BasePreferences.js';

/**
 * Implementation of SharedPreferences using in-memory storage (for Node.js or testing).
 */
export class MemorySharedPreferences implements BasePreferences {
  private store: Record<string, string> = {};

  /**
   * Creates a new MemorySharedPreferences instance.
   * @param namespace Namespace for all keys, similar to Android's SharedPreferences name. Required.
   */
  constructor(private readonly namespace: string) {
    if (!namespace) {
      throw new Error('Namespace is required for MemorySharedPreferences');
    }
  }

  /**
   * Retrieves a string value for the given key.
   * @param key The key to look up.
   * @param defaultValue The value to return if the key is not found.
   */
  getString(key: string, defaultValue?: string): string | undefined {
    const value = this.store[this.namespace + ':' + key];
    if (value === undefined) {
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
    this.store[this.namespace + ':' + key] = value;
  }

  /**
   * Retrieves an integer value for the given key.
   * @param key The key to look up.
   * @param defaultValue The value to return if the key is not found.
   */
  getInt(key: string, defaultValue?: number): number | undefined {
    const value = this.store[this.namespace + ':' + key];
    if (value === undefined) {
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
    this.store[this.namespace + ':' + key] = value.toString();
  }

  /**
   * Retrieves a boolean value for the given key.
   * @param key The key to look up.
   * @param defaultValue The value to return if the key is not found.
   */
  getBoolean(key: string, defaultValue?: boolean): boolean | undefined {
    const value = this.store[this.namespace + ':' + key];
    if (value === undefined) {
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
    this.store[this.namespace + ':' + key] = value ? 'true' : 'false';
  }

  /**
   * Removes the value for the given key.
   * @param key The key to remove.
   */
  remove(key: string): void {
    delete this.store[this.namespace + ':' + key];
  }

  /**
   * Clears all keys and values.
   */
  clear(): void {
    // Only remove keys with the namespace
    for (const key of Object.keys(this.store)) {
      if (key.startsWith(this.namespace + ':')) {
        delete this.store[key];
      }
    }
  }
}

export default MemorySharedPreferences;
