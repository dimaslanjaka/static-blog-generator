export declare function chain(schedule: {
    callback: (...args: any[]) => any;
    opt?: {
        before?: (...args: any[]) => any;
        after?: (...args: any[]) => any;
    };
}[]): Promise<void>;
