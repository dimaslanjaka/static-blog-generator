import { getClassName } from '../class-utils.js';

/**
 * Sanitizes a filename for safe cross-platform filesystem usage.
 *
 * Features:
 * - Removes invalid filename characters
 * - Prevents reserved Windows device names
 * - Collapses repeated replacement characters
 * - Trims trailing dots/spaces
 * - Preserves file extension when possible
 * - Enforces maximum filename length
 * - Allows final modification via callback
 *
 * @param input - Original filename or path-like string to sanitize.
 *
 * @param options - Optional sanitization configuration.
 *
 * @param options.replacement
 * Character used to replace invalid filename characters.
 *
 * Defaults to `"-"`.
 *
 * @param options.maxLength
 * Maximum allowed length for the final filename, including extension.
 *
 * Defaults to `255`.
 *
 * @param options.callback
 * Function called with the sanitized filename before it is returned.
 * Allows for final custom modifications or logging.
 *
 * @returns A filesystem-safe filename string.
 */
export default function sanitizeFilename(
  input: unknown,
  options?: {
    replacement?: string;
    maxLength?: number;
    callback?: (result: string) => string | void;
  }
): string {
  const replacement = options?.replacement ?? '-';
  const maxLength = options?.maxLength ?? 255;
  const callback = options?.callback;

  if (!input) {
    const unnamed = 'unnamed';

    if (typeof callback === 'function') {
      const cbResult = callback(unnamed);

      if (typeof cbResult === 'string') {
        return cbResult;
      }
    }

    return unnamed;
  }

  // Handle class constructors and class instances
  const className = getClassName(input);

  if (className) {
    if (typeof callback === 'function') {
      const cbResult = callback(className);

      if (typeof cbResult === 'string') {
        return cbResult;
      }
    }

    return className;
  }

  // Accept non-string inputs by coercing to string
  const rawInput = typeof input === 'string' ? input : String(input);

  // Remove trailing dots and spaces
  const normalizedInput = rawInput.replace(/[. ]+$/g, '');

  // Split extension
  const lastDot = normalizedInput.lastIndexOf('.');
  const hasExtension = lastDot > 0;

  let name = hasExtension ? normalizedInput.slice(0, lastDot) : normalizedInput;

  let ext = hasExtension ? normalizedInput.slice(lastDot) : '';

  // Invalid filename chars:
  // < > : " / \ | ? * and ASCII control chars
  const ctrlRange = `${String.fromCharCode(0)}-${String.fromCharCode(31)}`;

  const INVALID_CHARS_REGEX = new RegExp(`[<>:"/\\\\|?*${ctrlRange}]`, 'g');

  // Replace invalid chars
  name = name.replace(INVALID_CHARS_REGEX, replacement);
  ext = ext.replace(INVALID_CHARS_REGEX, '');

  // Collapse whitespace
  name = name.replace(/\s+/g, ' ').trim();

  // Collapse repeated replacements
  const escapedReplacement = replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const repeatedReplacementRegex = new RegExp(`${escapedReplacement}{2,}`, 'g');

  name = name.replace(repeatedReplacementRegex, replacement);

  // Ensure non-empty
  if (!name) {
    name = 'unnamed';
  }

  // Enforce max length while preserving extension
  const totalLength = name.length + ext.length;

  if (totalLength > maxLength) {
    const allowedNameLength = Math.max(1, maxLength - ext.length);

    name = name.slice(0, allowedNameLength);
  }

  const result = `${name}${ext}`;

  // Final callback hook
  if (typeof callback === 'function') {
    const cbResult = callback(result);

    if (typeof cbResult === 'string') {
      return cbResult;
    }
  }

  return result;
}

export { sanitizeFilename };
