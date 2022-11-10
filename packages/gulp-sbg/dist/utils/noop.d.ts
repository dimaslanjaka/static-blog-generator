/**
 * no operations
 * @param _args
 * @returns
 */
export default function noop(..._args: any[]): void;
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
export {};
