/**
 * clean white spaces
 * @param text
 * @param replacement replacement whitespace, default = ' '
 * @returns
 */
export function cleanWhiteSpace(text: string, replacement = ' ') {
  if (typeof text == 'string') return text.replace(/\s+/gm, replacement);
  return text;
}

/**
 * easy regex match
 * @param str
 * @param pattern
 * @returns
 */
export function strMatch(str: string, pattern: RegExp | string) {
  let regex: RegExp;
  if (typeof pattern == 'string') {
    regex = new RegExp(pattern, 'gm');
  } else {
    regex = pattern;
  }
  const match = str.match(regex) || false;
  if (Array.isArray(match)) {
    if (match.length > 0) return true;
  }
  return false;
}

/**
 * @see {@link strMatch}
 */
export const isMatch = strMatch;

/**
 * clean string with exception char
 * @param text
 * @returns
 */
export function cleanString(text: string, exception = '.,-_ ') {
  if (typeof text == 'string')
    return text.replace(new RegExp('[^a-zA-Z0-9' + exception + ']', 'gm'), '');
  return text;
}

/**
 * count words boundary
 * @param str
 * @returns
 */
export function countWords(str: string) {
  str = str.replace(/(^\s*)|(\s*$)/gi, '');
  str = str.replace(/[ ]{2,}/gi, ' ');
  str = str.replace(/\n /, '\n');
  return str.split(' ').length;
}

/**
 * Replace string by array pattern
 * @param array
 * @param replacement
 * @example
 * replaceArr('str', ['s','r'], ''); // t
 * replaceArr('str', ['s','r'], ['a s', 'ring']); // a string
 */
export function replaceArr(
  str: string,
  array: (string | RegExp)[],
  replacement: string | string[]
) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let ori = str;
  array.forEach((str, i) => {
    if (typeof replacement == 'string') {
      ori = ori.replace(str, replacement);
    } else {
      ori = ori.replace(str, replacement[i]);
    }
  });

  return ori;
}

export interface String {
  /**
   * Replace all instances of a substring in a string, using a regular expression or search string.
   * @param searchValue A string to search for.
   * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
   */
  replaceAll(searchValue: string | RegExp, replaceValue: string): string;

  /**
   * Replace all instances of a substring in a string, using a regular expression or search string.
   * @param searchValue A string to search for.
   * @param replacer A function that returns the replacement text.
   */
  replaceAll(
    searchValue: string | RegExp,
    replacer: (substring: string, ...args: any[]) => string
  ): string;
}
if (typeof ''.replaceAll != 'function') {
  String.prototype.replaceAll = function (
    search: string | RegExp,
    replacement: any
  ) {
    const find = typeof search == 'string' ? new RegExp(search, 'g') : search;
    return this.replace(find, replacement);
  };
}

/**
 * is variable an empty string ?
 * @param str
 * @returns
 */
export function isEmptyStr(str: any) {
  const isStr = typeof str === 'string';
  const isEmpty = isStr && str.trim().length > 0;
  return isEmpty;
}
