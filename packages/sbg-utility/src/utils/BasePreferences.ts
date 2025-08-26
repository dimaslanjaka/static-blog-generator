/**
 * SharedPreferences provides a simple key-value storage API similar to Android's SharedPreferences.
 * Uses localStorage as the backend. For Node.js, a polyfill or alternative backend is needed.
 */
export default interface BasePreferences {
  /**
   * Retrieves a string value for the given key.
   * @param key The key to look up.
   * @param defaultValue The value to return if the key is not found.
   * @returns The string value, or defaultValue if not found.
   */
  getString(key: string, defaultValue?: string): string | undefined;

  /**
   * Stores a string value for the given key.
   * @param key The key to store.
   * @param value The string value to store.
   */
  putString(key: string, value: string): void;

  /**
   * Retrieves an integer value for the given key.
   * @param key The key to look up.
   * @param defaultValue The value to return if the key is not found.
   * @returns The integer value, or defaultValue if not found.
   */
  getInt(key: string, defaultValue?: number): number | undefined;

  /**
   * Stores an integer value for the given key.
   * @param key The key to store.
   * @param value The integer value to store.
   */
  putInt(key: string, value: number): void;

  /**
   * Retrieves a boolean value for the given key.
   * @param key The key to look up.
   * @param defaultValue The value to return if the key is not found.
   * @returns The boolean value, or defaultValue if not found.
   */
  getBoolean(key: string, defaultValue?: boolean): boolean | undefined;

  /**
   * Stores a boolean value for the given key.
   * @param key The key to store.
   * @param value The boolean value to store.
   */
  putBoolean(key: string, value: boolean): void;

  /**
   * Removes the value for the given key.
   * @param key The key to remove.
   */
  remove(key: string): void;

  /**
   * Clears all keys and values.
   */
  clear(): void;
}
