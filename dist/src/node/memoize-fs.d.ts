declare type Func = (...args: any[]) => any;
declare class memoizer {
    cache: {};
    memoize: <F extends Func>(fn: F) => F;
    /**
     * @see {@link memoizer.memoize}
     */
    fn: <F extends Func>(fn: F) => F;
    /**
     * cache directory
     */
    cacheDir: string;
    verbose: boolean;
    /**
     * determine function return type
     * @param arg
     * @returns
     */
    determineType(arg: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array";
    /**
     * clear cache function
     * @param fn
     */
    clear(fn: Func, ...args: any[]): void;
    /**
     * get function cache file
     * @param fn
     * @param args
     * @returns
     */
    getCacheFilePath(fn: Func, ...args: any[]): string;
    /**
     * determine function
     * @param fn
     * @param _args
     * @returns
     */
    private determinefn;
}
export default memoizer;
export declare const memoizeFs: <F extends Func>(fn: F) => F;
