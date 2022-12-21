/// <reference types="node" />
import { persistentCache } from 'persistent-cache';
export declare function getShaFile(file: string): string | null;
export declare const md5: (data: string) => string;
export type gulpCachedOpt = Parameters<typeof persistentCache>[0] & {
    prefix?: string;
};
export declare function gulpCached(options?: gulpCachedOpt): import("stream").Transform;
export default gulpCached;
