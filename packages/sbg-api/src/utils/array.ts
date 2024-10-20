/**
 * Parses a string representation of an array and converts it to an actual array.
 *
 * The function replaces unquoted words with quoted ones and keeps already quoted values intact.
 * This allows for a mixed input format where both unquoted and quoted strings are present.
 *
 * @param str - A string representation of an array (e.g., `"[android, json]"`).
 * @returns An array of strings parsed from the input string.
 *
 * @example
 * const str1 = "[android, json]";
 * const arr1 = parseDynamicArray(str1);
 * console.log(arr1); // Output: ['android', 'json']
 *
 * const str2 = "[android, json, \"data\", 'data2']";
 * const arr2 = parseDynamicArray(str2);
 * console.log(arr2); // Output: ['android', 'json', 'data', 'data2']
 */
export function parseDynamicArray(str: string): string[] {
  // Replace unquoted words with quoted ones and keep already quoted values intact
  const formattedStr = str.replace(/([a-zA-Z0-9_]+)/g, '"$1"');
  return JSON.parse(formattedStr);
}
