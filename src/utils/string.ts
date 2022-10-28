import { isValidHttpUrl } from '../gulp/utils';

export function removeDoubleSlashes(str: string) {
  if (isValidHttpUrl(str)) return str.replace(/([^:]\/)\/+/g, '$1');
  return str.replace(/\/+/g, '/');
}
