/**
 * Configuration options for isEmpty and isNotEmpty functions.
 */
export interface EmptyOptions {
  /**
   * If true, treats whitespace-only strings as empty; defaults to false
   */
  allowWhitespace?: boolean;
}

/**
 * Checks if a value is empty.
 *
 * Returns true if the value is:
 * - null or undefined
 * - an empty string
 * - an empty array
 * - an empty object
 *
 * @param value - The value to check
 * @param options - Configuration options
 * @param options.allowWhitespace - If true, treats whitespace-only strings as empty; defaults to false
 * @returns true if the value is empty, false otherwise
 */
export function isEmpty(value: unknown, options: EmptyOptions = {}): boolean {
  if (!options) options = {};
  if (value == null) return true; // null or undefined
  if (typeof value === 'string') {
    return options.allowWhitespace ? value.trim().length === 0 : value.length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Set || value instanceof Map) {
    return value.size === 0;
  }
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Checks if a value is not empty.
 *
 * This is the inverse of isEmpty(). Returns true if the value is not empty.
 *
 * @param value - The value to check
 * @param options - Configuration options
 * @param options.allowWhitespace - If true, treats whitespace-only strings as empty; defaults to false
 * @returns true if the value is not empty, false otherwise
 */
export function isNotEmpty(value: unknown, options: EmptyOptions = {}): boolean {
  return !isEmpty(value, options);
}

export default isEmpty;
