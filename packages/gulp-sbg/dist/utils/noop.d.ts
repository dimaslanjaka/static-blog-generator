/**
 * no operations
 * @param _args
 * @returns
 */
export declare function noop(..._args: any[]): void;
export default noop;
interface FN extends CallableFunction {
    then: CallableFunction;
    catch: CallableFunction;
}
/**
 * try catch nooperation
 * @param fn
 * @returns
 */
export declare function trycatchnoop(fn: FN): any;
