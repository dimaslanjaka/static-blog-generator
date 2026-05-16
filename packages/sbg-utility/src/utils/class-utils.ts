/**
 * Determines if the provided object is a class constructor.
 * @param obj The object to check.
 * Returns true if obj is a class constructor, false otherwise.
 */
export function isClass(obj: unknown): boolean {
  if (typeof obj !== 'function') {
    return false;
  }

  const str = Function.prototype.toString.call(obj);

  // ES6 class
  if (/^class\s/.test(str)) {
    return true;
  }

  // Arrow functions have no prototype
  if (!obj.prototype) {
    return false;
  }

  // Old constructor-style function:
  // uses `this`
  return /\bthis\./.test(str);
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

/**
 * Gets the function name from a function.
 * @param func The function to inspect.
 * Returns the function name, or null if it cannot be determined.
 */
export function getFunctionName(func: unknown): string | null {
  if (typeof func !== 'function') {
    return null;
  }

  // Exclude class constructors
  if (isClass(func)) {
    return null;
  }

  return func.name || null;
}
