/**
 * clean white spaces
 * @param s
 * @returns
 */

export function cleanWhiteSpace(text: string) {
  if (typeof text == 'string') return text.replace(/\s+/gm, ' ');
  return text;
}

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
