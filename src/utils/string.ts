import { isValidHttpUrl } from '../gulp/utils';

export function removeDoubleSlashes(str: string) {
  if (isValidHttpUrl(str)) return str.replace(/([^:]\/)\/+/g, '$1');
  return str.replace(/\/+/g, '/');
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
