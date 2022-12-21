declare class Logger {
    static log(...args: any[]): void;
    private static tracer;
}
export default Logger;
