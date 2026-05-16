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
 *
 * @example
 * sanitizeFilename("my:file?.txt");
 * // => "my-file-.txt"
 *
 * @example
 * sanitizeFilename("CON");
 * // => "CON-"
 *
 * @example
 * sanitizeFilename("invoice/2026:Q1.pdf");
 * // => "invoice-2026-Q1.pdf"
 *
 * @example
 * sanitizeFilename("data.txt", { callback: (name) => name.toUpperCase() });
 * // => "DATA.TXT"
 */
export default function sanitizeFilename(
  input: string,
  options?: {
    replacement?: string;
    maxLength?: number;
    callback?: (result: string) => string | void;
  }
): string {
  const replacement = options?.replacement ?? '-';
  const maxLength = options?.maxLength ?? 255;
  const callback = options?.callback;

  if (!input || typeof input !== 'string') {
    const unnamed = 'unnamed';
    if (typeof callback === 'function') {
      const cbResult = callback(unnamed);
      if (typeof cbResult === 'string') {
        return cbResult;
      }
    }
    return unnamed;
  }

  // Remove trailing dots and spaces before extension parsing so Windows-safe
  // cleanup does not preserve a dangling suffix.
  const normalizedInput = input.replace(/[. ]+$/g, '');

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

  // Reserved Windows filenames
  const RESERVED_NAMES = new Set([
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9'
  ]);

  if (RESERVED_NAMES.has(name.toUpperCase())) {
    name = `${name}${replacement}`;
  }

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

  // Call callback if provided; only use its return value when it's a string
  if (typeof callback === 'function') {
    const cbResult = callback(result);
    if (typeof cbResult === 'string') {
      return cbResult;
    }
  }

  return result;
}

export { sanitizeFilename };
