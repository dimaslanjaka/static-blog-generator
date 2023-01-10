import debuglib from 'debug';

/**
 * debug helper
 * @param name
 * @returns
 */
export default function debug(name: string) {
  return debuglib(name);
}
