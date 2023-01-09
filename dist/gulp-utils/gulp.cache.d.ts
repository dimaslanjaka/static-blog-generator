/// <reference types="node" />
import { persistentCache } from 'persistent-cache';
import internal from 'stream';
export declare function getShaFile(file: string): string | null;
export declare const md5: (data: string) => string;
export type gulpCachedOpt = Parameters<typeof persistentCache>[0] & {
    prefix?: string;
    dest?: string;
    cwd?: string;
    verbose?: boolean;
};
export declare function gulpCached(options: gulpCachedOpt & {
    dest?: string;
    cwd?: string;
}): internal.Transform;
export default gulpCached;
