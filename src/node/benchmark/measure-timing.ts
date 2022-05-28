import { FunctionType } from '../../parser/utility';
import color from '../color';

/**
 * Timer measurement
 * @see {@link https://stackoverflow.com/a/69985194/6404439}
 */
export class MeasureTime {
  private startTime = 0;
  private endTime = 0;

  /**
   * measure time execution
   * @see {@link https://stackoverflow.com/a/70004960/6404439}
   * @param fn
   * @param args
   */
  async run<T extends FunctionType | Promise<FunctionType>, U extends any[]>(
    msg: string = null,
    fn: T,
    ...args: U
  ) {
    const isFunc = typeof fn == 'function';
    const isAsync =
      isFunc &&
      typeof fn['then'] === 'function' &&
      String(fn[Symbol.toStringTag]) === 'Promise';
    //console.log('cName', fn.constructor.name);
    console.log(`---start [${isAsync ? 'async' : 'sync'}]---`);
    if (isFunc) {
      //console.log('then', typeof fn['then']);
      //console.log('symbol', fn[Symbol.toStringTag]);
      if (isAsync) {
        this.start();
        await fn.apply(null, ...args);
        console.log(
          color.Apricot('[async]'),
          color.greenBright(msg),
          this.end()
        );
      } else {
        this.start();
        try {
          fn.apply(null, ...args);
        } catch (error) {
          await fn.call(null, ...args);
        }
        console.log(
          color.Apricot('[sync]'),
          color.greenBright(msg),
          this.end()
        );
      }
    }
    console.log(`---end [${isAsync ? 'async' : 'sync'}]---`);
    return this;
  }

  /**
   * @see {@link MeasureTime['run']}
   * @param fn
   * @param args
   * @returns
   */
  measure(fn: any, ...args: any[]) {
    return this.run(null, fn, ...args);
  }

  start() {
    this.startTime = new Date().getTime();
    return this;
  }
  /**
   * end indicator
   * @returns dump
   */
  end() {
    this.endTime = new Date().getTime();
    return this.toString();
  }
  toString() {
    return `time taken => ${(this.endTime - this.startTime) / 1000} seconds`;
  }
}
export default MeasureTime;
