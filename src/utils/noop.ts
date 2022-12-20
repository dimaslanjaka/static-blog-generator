/**
 * no operations
 * @param _args
 * @returns
 */
export function noop(..._args: any[]) {
  return;
}

export default noop;

export type Func = (...args: any[]) => any & CallableFunction;

export interface FN extends Func {
  then: (...args: any[]) => any;
  catch: (...args: any[]) => any;
}

/**
 * try catch nooperation
 * @param fn
 * @returns
 */
export function trycatchnoop(fn: FN) {
  try {
    if (typeof fn.catch === 'function') return fn.catch(noop);
    if (typeof fn === 'function') fn();
  } catch {
    //
  }
}
