/**
 * Function type
 */
export interface FunctionType {
  (): any;
  (arg0: any): any;
  (...arg0: any[]): any;
}

/**
 * transform any variable type to string
 * @param varObj
 * @returns
 * @example
 * const func = () => {};
 * const funcName = varToString({ func });
 * console.log(funcName); // func
 */
export const varToString = (varObj: { func?: FunctionType }) =>
  Object.keys(varObj)[0];

/**
 * get function name
 * @param func
 * @returns
 */
export const getFuncName = (func: FunctionType) => {
  return func.name || varToString({ func });
};
