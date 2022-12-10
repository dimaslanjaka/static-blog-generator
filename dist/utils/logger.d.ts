/**
 * @example
 * const console = Logger
 * console.log('hello world'); // should be written in ./tmp/logs/gulp-sbg/[trace-name].log
 */
declare class Logger {
    static log(...args: any[]): void;
    private static tracer;
}
export default Logger;
