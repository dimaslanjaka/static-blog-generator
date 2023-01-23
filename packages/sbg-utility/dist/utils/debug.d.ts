import debuglib from 'debug';
/**
 * debug helper
 * @param name
 * @returns
 */
export default function debug(name: string): debuglib.Debugger;
/**
 * debug with default name `sbg`
 * @returns
 */
export declare function sbgDebug(): debuglib.Debugger;
