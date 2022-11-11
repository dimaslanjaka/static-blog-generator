/// <reference types="node" />
import { persistentCache } from 'persistent-cache';
/**
 * calculate sha1sum of file
 * @param file
 * @returns
 */
export declare function getShaFile(file: string): string | null;
export declare const md5: (data: string) => string;
/**
 *
 * @param options
 * @returns
 */
export declare function gulpCached(options?: Parameters<typeof persistentCache>[0]): import("stream").Transform;
