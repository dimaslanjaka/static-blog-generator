/**
 * no operations
 * @param _args
 * @returns
 */
export function noop(..._args: any[]) {
  return;
}

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
export function trycatchnoop(fn: FN) {
  try {
    if (typeof fn.catch === 'function') return fn.catch(noop);
    if (typeof fn === 'function') fn();
  } catch {
    //
  }
}
