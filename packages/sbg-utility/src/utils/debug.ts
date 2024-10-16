import debuglib from 'debug';

/**
 * Creates a debug logger with the specified name.
 *
 * @param name - The name of the debug logger. This will be used as a prefix for log messages.
 * @returns A debug logger function that can be used to log messages.
 */
export function debug(name: string) {
  return debuglib(name);
}

/**
 * Creates a debug logger with the default name `sbg`.
 *
 * This function allows for an optional subname to further specify the debug logger.
 *
 * @param subname - An optional suffix to append to the default logger name.
 * @returns A debug logger function with the name `sbg` or `sbg-{subname}` if provided.
 */
export function sbgDebug(subname?: string) {
  if (subname) return debuglib(`sbg-${subname}`);
  return debuglib('sbg');
}
