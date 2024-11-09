import ansiColors from 'ansi-colors';
import { isReadableStream, isStream, isWritableStream } from 'is-stream';
import Logger from './logger';

/**
 * Chainable function runner.
 *
 * @param schedule - An array of function objects, each containing a callback and optional `opt` properties for before and after functions.
 * @example
 * ```ts
 * chain([
 *   {
 *     callback: () => 'stream process eg: gulp',
 *     opt: {
 *       before: () => 'run before callback called',
 *       after: () => 'run after callback called'
 *     }
 *   },
 *   {
 *     callback: () => 'promise process'
 *   },
 *   {
 *     callback: () => 'synchronous function'
 *   }
 * ]);
 * ```
 */
export async function chain(
  schedule: {
    /**
     * Function to call inside chains.
     */
    callback: (...args: any[]) => any;
    opt?: {
      /**
       * Function to run before the callback is called.
       */
      before?: (...args: any[]) => any;
      /**
       * Function to run after the callback is called.
       */
      after?: (...args: any[]) => any;
    };
  }[]
) {
  // NodeJS.ReadWriteStream | Promise<any>

  const run = function (this: any, instance: (typeof schedule)[number]) {
    return new Promise((resolve) => {
      const logname = ansiColors.blueBright('chain') + '.' + ansiColors.yellowBright('run');
      if (instance.opt?.before) {
        instance.opt.before();
      }
      const obj = instance.callback.call && instance.callback.call(null);
      // Logger.log(
      //   `is readable stream ${isReadableStream(obj)}`,
      //   `is writable stream ${isWritableStream(obj)}`,
      //   `is promise ${isPromise(obj)}`,
      //   `is stream ${isStream(obj)}`,
      //   { keys: Object.keys(obj) }
      // );

      if (isReadableStream(obj)) {
        Logger.log('readable stream');
        return obj.once('end', async () => {
          if (instance.opt?.after) {
            await instance.opt.after();
            return resolve(this);
          } else {
            return resolve(this);
          }
        });
      } else if (isWritableStream(obj)) {
        Logger.log('writable stream');
        return obj.once('finish', async () => {
          if (instance.opt?.after) {
            await instance.opt.after();
            return resolve(this);
          } else {
            return resolve(this);
          }
        });
      } else if (isStream(obj)) {
        // gulp instance / readwrite stream
        return obj.once('end', async () => {
          if (instance.opt?.after) {
            await instance.opt.after();
            return resolve(this);
          } else {
            return resolve(this);
          }
        });
      } else if (isPromise(obj)) {
        //Logger.log('promises');
        return obj.then(async () => {
          if (instance.opt?.after) {
            await instance.opt.after();
            return resolve(this);
          } else {
            return resolve(this);
          }
        });
      } else {
        if (typeof instance.callback !== 'function') {
          Logger.log(logname, 'cannot determine method instances');
        }
      }

      resolve.bind(this)(chain.bind(this));
    });
  };

  while (schedule.length > 0) {
    const instance = schedule.shift();
    if (typeof instance !== 'undefined') await run(instance);
  }
}

/**
 * check object is Promises
 * @param p
 * @returns
 */
function isPromise(p: { constructor: any }) {
  return (
    (p && String(Object.prototype.toString.call(p)).toLowerCase() === '[object promise]') ||
    // check ES6 Promises
    (p &&
      typeof p.constructor === 'function' &&
      Function.prototype.toString.call(p.constructor).replace(/\(.*\)/, '()') ===
        Function.prototype.toString
          .call(/*native object*/ Function)
          .replace('Function', 'Promise') // replacing Identifier
          .replace(/\(.*\)/, '()')) || // removing possible FormalParameterList
    // my own experiment
    (p && String(Function.prototype.toString.call(p.constructor)).startsWith('function Promise('))
  );
}
