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
export function isEmpty(value: unknown, options: { allowWhitespace?: boolean } = {}): boolean {
  if (!options) options = {};
  if (value == null) return true; // null or undefined
  if (typeof value === 'string') {
    return options.allowWhitespace ? value.trim().length === 0 : value.length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export default isEmpty;
