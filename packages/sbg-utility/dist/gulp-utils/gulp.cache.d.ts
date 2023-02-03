/// <reference types="node" />
import { persistentCache } from 'persistent-cache';
import internal from 'stream';
/**
 * calculate sha1sum of file
 * @param file
 * @returns
 */
export declare function getShaFile(file: string): string;
/**
 * MD5 hash generator
 * @param data
 * @returns
 */
export declare const md5: (data: string) => string;
export type gulpCachedOpt = Parameters<typeof persistentCache>[0] & {
    prefix?: string;
    /**
     * dest folder
     * * required cwd option
     * * ~cannot match different extension
     */
    dest?: string;
    /**
     * cwd source
     * * required dest option
     * * ~cannot match different extension
     */
    cwd?: string;
    /**
     * verbose
     */
    verbose?: boolean;
    /**
     * delete after process.exit
     */
    deleteOnExit?: boolean;
};
export declare function gulpCached(options: gulpCachedOpt & {
    dest?: string;
    cwd?: string;
}): internal.Transform;
export default gulpCached;
