import { varToString } from '../parser/utility';

/**
 * Timer measurement
 * @see {@link https://stackoverflow.com/a/69985194/6404439}
 */
export class MeasureTime {
  private startTime = 0;
  private endTime = 0;
  run(fn: any, msg?: string) {
    if (typeof fn == 'function') {
      if (
        typeof fn.then === 'function' &&
        fn[Symbol.toStringTag] === 'Promise'
      ) {
        this.start();
        fn().then(console.log(msg, this.end()));
      } else {
        this.start();
        fn();
        console.log(msg, this.end());
      }
    }
  }
  /**
   * measure time execution
   * @see {@link https://stackoverflow.com/a/70004960/6404439}
   * @param fn
   * @param args
   */
  measure(fn: any, ...args: any[]) {
    const displayName = fn.name || varToString({ func: fn });
    console.time(displayName);
    //const tupleArgs = [...args];
    //func(tupleArgs);
    fn.apply(null, ...args);
    console.timeEnd(displayName);
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
