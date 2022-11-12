/// <reference types="node" />
import { persistentCache } from 'persistent-cache';
/**
 * calculate sha1sum of file
 * @param file
 * @returns
 */
export declare function getShaFile(file: string): string | null;
export declare const md5: (data: string) => string;
export declare type gulpCachedOpt = Parameters<typeof persistentCache>[0] & {
    prefix?: string;
};
/**
 * * [source idea](https://github.com/gulp-community/gulp-cached/blob/8e8d13cb07b17113ff94700e87f136eeaa1f1340/index.js#L35-L44)
 * @param options
 * @returns
 */
export declare function gulpCached(options?: gulpCachedOpt): import("stream").Transform;
