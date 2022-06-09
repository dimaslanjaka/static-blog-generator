/**
 * Timer measurement
 * @see {@link https://stackoverflow.com/a/69985194/6404439}
 */
export declare class MeasureTime {
    private startTime;
    private endTime;
    /**
     * measure time execution
     * @see {@link https://stackoverflow.com/a/70004960/6404439}
     * @param fn
     * @param args
     */
    run<T, U extends any[]>(msg: string, fn: T, ...args: U): Promise<this>;
    /**
     * @see {@link MeasureTime['run']}
     * @param fn
     * @param args
     * @returns
     */
    measure(fn: any, ...args: any[]): Promise<this>;
    start(): this;
    /**
     * end indicator
     * @returns dump
     */
    end(): string;
    toString(): string;
}
export default MeasureTime;
