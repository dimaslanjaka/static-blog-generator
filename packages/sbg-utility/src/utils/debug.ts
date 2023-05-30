import debuglib from 'debug';

/**
 * debug helper
 * @param name
 * @returns
 */
export function debug(name: string) {
  return debuglib(name);
}

export default debug;

/**
 * debug with default name `sbg`
 * @returns
 */
export function sbgDebug() {
  return debuglib('sbg');
}
