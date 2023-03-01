import Bluebird from 'bluebird';

export type CallableFunctions = (...args: any[]) => any;
export type CallablePromiseFunctions = (...args: any[]) => Promise<any>;
export type CallableMixFunctions = CallableFunctions | CallablePromiseFunctions;

export function promisify<T>(
  func: (callback: CallableMixFunctions) => void,
  options?: Bluebird.PromisifyOptions
): () => Bluebird<T>;
export function promisify<T, A1>(
  func: (arg1: A1, callback: CallableMixFunctions) => void,
  options?: Bluebird.PromisifyOptions
): (arg1: A1) => Bluebird<T>;
export function promisify<T, A1, A2>(
  func: (arg1: A1, arg2: A2, callback: CallableMixFunctions) => void,
  options?: Bluebird.PromisifyOptions
): (arg1: A1, arg2: A2) => Bluebird<T>;
export function promisify<T, A1, A2, A3>(
  func: (arg1: A1, arg2: A2, arg3: A3, callback: CallableMixFunctions) => void,
  options?: Bluebird.PromisifyOptions
): (arg1: A1, arg2: A2, arg3: A3) => Bluebird<T>;
export function promisify<T, A1, A2, A3, A4>(
  func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: CallableMixFunctions) => void,
  options?: Bluebird.PromisifyOptions
): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Bluebird<T>;
export function promisify<T, A1, A2, A3, A4, A5>(
  func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: CallableMixFunctions) => void,
  options?: Bluebird.PromisifyOptions
): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => Bluebird<T>;
export function promisify(
  func: (...args: any[]) => void,
  options?: Bluebird.PromisifyOptions
): (...args: any[]) => Bluebird<any>;

/**
 * make any function to be promise
 * @param func
 * @param options
 * @returns
 */
export function promisify<T>(func: T, options?: Bluebird.PromisifyOptions) {
  return Bluebird.promisify<T>(<any>func, options);
}
