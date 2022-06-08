interface dumpCallerOpt {
    lib: boolean;
}
/**
 * Dump caller function lines, path
 * @param n
 * @returns
 */
export declare function dumpCaller(n: number): string;
export declare function dumpCaller(n?: number, opt?: Partial<dumpCallerOpt>): string[];
export {};
