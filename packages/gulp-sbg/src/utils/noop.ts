/**
 * no operations
 * @param _args
 * @returns
 */
export default function noop(..._args: any[]) {
  return;
}

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
