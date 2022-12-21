export declare function noop(..._args: any[]): void;
export default noop;
export type Func = (...args: any[]) => any & CallableFunction;
export interface FN extends Func {
    then: (...args: any[]) => any;
    catch: (...args: any[]) => any;
}
export declare function trycatchnoop(fn: FN): any;
