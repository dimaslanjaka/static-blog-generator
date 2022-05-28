import memoizee from 'memoizee';
import { TypedEmitter } from 'tiny-typed-emitter';
import { DynamicObject } from '../types';
import './cache-serialize';
import memoizer from './memoize-fs';
/**
 * default folder to save databases
 */
export declare const dbFolder: string;
export interface CacheOpt {
    /**
     * immediately save cache value
     * * default false
     */
    sync?: boolean;
    /**
     * root/folder to save entire databases
     * * default node_modules/.cache/dimaslanjaka
     */
    folder?: string;
}
/**
 * @default
 */
export declare type ResovableValue = {
    /**
     * resolve all `cache value` instead `value location file`, default `true`
     */
    resolveValue?: boolean;
    /**
     * max result, default null
     */
    max?: number;
    /**
     * randomize entries, default false
     */
    randomize?: boolean;
};
export declare const defaultResovableValue: ResovableValue;
interface CacheFileEvent {
    update: () => void;
}
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
export default class CacheFile extends TypedEmitter<CacheFileEvent> {
    getInstance(): this;
    private total;
    getTotal(): number;
    /**
     * memoizer persistent file
     * * cached function result for reusable
     * @see {@link memoizer}
     */
    static memoizer: memoizer;
    md5Cache: DynamicObject;
    dbFile: string;
    static options: CacheOpt;
    private currentHash;
    constructor(hash?: any, opt?: CacheOpt);
    /**
     * clear cache
     * @returns
     */
    clear(): Promise<Error[]>;
    /**
     * @see {@link CacheFile.set}
     * @param key
     * @param value
     * @returns
     */
    setCache: (key: string, value: any) => CacheFile;
    /**
     * resolve long text on key
     */
    resolveKey(key: string): string;
    /**
     * locate ${CacheFile.options.folder}/${currentHash}/${unique key hash}
     * @param key
     * @returns
     */
    locateKey: (key: string) => string;
    dump(key?: string): {
        resolveKey: string;
        locateKey: string;
        db: string;
    };
    set(key: string, value: any): CacheFile;
    /**
     * check cache key exist
     * @param key key cache
     * @returns boolean
     */
    has(key: string): boolean;
    /**
     * Get cache by key
     * @param key
     * @param fallback
     * @returns
     */
    get<T>(key: string, fallback?: T): T;
    getCache: (key: string, fallback?: any) => any;
    /**
     * get all databases
     * @param opt Options
     * @returns object keys and values
     */
    getAll(opt?: ResovableValue): DynamicObject;
    /**
     * get all database values
     * @param opt Options
     * @returns array values
     */
    getValues(opt?: ResovableValue): any[];
    /**
     * Check file is changed with md5 algorithm
     * @param path0
     * @returns
     */
    isFileChanged(path0: string): boolean;
}
/**
 * persistent cache
 * @param name cache name
 * @returns
 */
export declare const pcache: ((name: string) => {
    put: (name: string, data: any, callback: any) => any;
    get: <T>(name: string, callback: (err: Error, data: T) => any) => any;
    delete: (name: string, callback: any) => void;
    deleteSync: (name: string) => void;
    putSync: (name: string, data: any) => void;
    getSync: <T_1>(name: string) => T_1;
    keys: (callback: (keys: string[]) => any) => any;
    keysSync: () => string[];
    unlink: (callback: any) => any;
    valuesSync: <T_2 extends any[]>() => T_2;
}) & memoizee.Memoized<(name: string) => {
    put: (name: string, data: any, callback: any) => any;
    get: <T>(name: string, callback: (err: Error, data: T) => any) => any;
    delete: (name: string, callback: any) => void;
    deleteSync: (name: string) => void;
    putSync: (name: string, data: any) => void;
    getSync: <T_1>(name: string) => T_1;
    keys: (callback: (keys: string[]) => any) => any;
    keysSync: () => string[];
    unlink: (callback: any) => any;
    valuesSync: <T_2 extends any[]>() => T_2;
}>;
export {};
