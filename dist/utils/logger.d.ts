import 'nodejs-package-types';
declare class Logger {
    static log(...args: any[]): void;
    static info(...args: any[]): void;
    static error(...args: any[]): void;
    private static tracer;
}
export default Logger;
