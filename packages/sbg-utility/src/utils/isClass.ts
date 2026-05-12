/**
 * Determines if the provided object is a class constructor.
 * @param obj The object to check.
 * Returns true if obj is a class constructor, false otherwise.
 */
export function isClass(obj: unknown): boolean {
  return (
    typeof obj === 'function' &&
    (/^class\s/.test(Function.prototype.toString.call(obj)) || Object.getOwnPropertyNames(obj.prototype).length > 1)
  );
}
