/**
 * Generic function type
 *
 * Usage
 * * JSDOC `@var/@type` `{FunctionType<string>}` describe function return an `string`
 * * JSDOC `@var/@type` `{FunctionType<string, number>}` describe function return an `string` with arguments type number
 * * JSDOC `@var/@type` `{FunctionType<string, number | string>}` describe function return an `string` with variadic or single arguments type number or string
 * @param T Return type
 * @param U Argument type
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com> (https://www.webmanajemen.com)
 * @license MIT
 */
export declare type FunctionType<T = any, U = any> = (...arg0: U[]) => T;
/**
 * transform any variable type to string
 * @param varObj
 * @returns
 * @example
 * const func = () => {};
 * const funcName = varToString({ func });
 * console.log(funcName); // func
 */
export declare const varToString: (varObj: {
    func?: FunctionType<string>;
}) => string;
/**
 * get function name
 * @param func
 * @returns
 */
export declare const getFuncName: (func: FunctionType<string>) => string;
