import stream from 'stream';

/**
 * Chainable function runner
 * @param schedule array of function objects
 */
export async function chain(
  schedule: {
    /**
     * function to call inside chains
     */
    callback: CallableFunction;
    opt?: {
      /**
       * run before callback called
       */
      before?: CallableFunction;
      /**
       * run after callback called
       */
      after?: CallableFunction;
    };
  }[]
) {
  // NodeJS.ReadWriteStream | Promise<any>

  const run = (instance: typeof schedule[number]) =>
    new Promise(function (resolve) {
      if (instance.opt?.before) {
        instance.opt.before();
      }
      const obj = instance.callback();
      const isReadableStream = function (obj: { _read: string; _readableState: string }) {
        return (
          obj instanceof stream.Stream && typeof (obj._read === 'function') && typeof (obj._readableState === 'object')
        );
      };
      if (isReadableStream(obj) && obj instanceof stream.Stream) {
        // console.log('readable stream');
        return obj.once('end', function () {
          resolve.bind(chain)(chain.bind(this));
        });
      } else if (obj instanceof stream.Writable) {
        console.log('writable stream');
      } else if (obj instanceof Promise) {
        console.log('promises');
      } else {
        console.log('cannot determine method instances');
      }

      resolve.bind(this)(chain.bind(this));
    });

  while (schedule.length > 0) {
    const instance = schedule.shift();
    if (typeof instance !== 'undefined') await run(instance);
  }
}
