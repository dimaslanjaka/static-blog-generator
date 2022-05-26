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
export type FunctionType<T = any, U = any> = (...arg0: U[]) => T;
const _fn: FunctionType<string, number> = (n) => {
  return ['x'][n];
};
const _fns: FunctionType<string, number | string> = (n, s) => {
  return ['x', s][n];
};
const _fa: FunctionType<string, number | string> = (n, ...s) => {
  return String([String(n), String(s)]);
};

/**
 * transform any variable type to string
 * @param varObj
 * @returns
 * @example
 * const func = () => {};
 * const funcName = varToString({ func });
 * console.log(funcName); // func
 */
export const varToString = (varObj: { func?: FunctionType<string> }) =>
  Object.keys(varObj)[0];

/**
 * get function name
 * @param func
 * @returns
 */
export const getFuncName = (func: FunctionType<string>) => {
  return func.name || varToString({ func });
};
