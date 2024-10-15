import debuglib from 'debug';

/**
 * debug helper
 * @param name
 * @returns
 */
function debug(name) {
    return debuglib(name);
}
/**
 * debug with default name `sbg`
 * @returns
 */
function sbgDebug() {
    return debuglib('sbg');
}

export { debug, debug as default, sbgDebug };
