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

/**
 * Gets the class name from a class constructor or class instance.
 * @param obj The class constructor or instance.
 * Returns the class name, or null if it cannot be determined.
 */
export function getClassName(obj: unknown): string | null {
  if (obj == null) {
    return null;
  }

  // Class constructor
  if (isClass(obj)) {
    return (obj as { name: string }).name || null;
  }

  // Class instance
  if (typeof obj === 'object') {
    const ctor = (obj as object).constructor;

    if (isClass(ctor)) {
      return ctor.name || null;
    }
  }

  return null;
}
