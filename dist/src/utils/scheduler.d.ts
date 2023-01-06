export declare function bindProcessExit(key: string, fn: (...args: any[]) => any): void;
declare class scheduler {
    static verbose: boolean;
    constructor();
    private static registered;
    static register(): void;
    static add(key: string, value: () => any): void;
    private static postponeCounter;
    static postpone(key: string, value: () => any): void;
    static execute(key: string, deleteAfter?: boolean): void;
    static executeAll(): void;
    private static clearArray;
}
export default scheduler;
