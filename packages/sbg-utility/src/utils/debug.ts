import debuglib from 'debug';

/**
 * debug helper
 * @param name
 * @returns
 */
export default function debug(name: string) {
  return debuglib(name);
}

/**
 * debug with default name `sbg`
 * @returns
 */
export function sbgDebug() {
  return debuglib('sbg');
}
