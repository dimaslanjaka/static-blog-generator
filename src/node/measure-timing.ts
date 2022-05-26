import { varToString } from '../parser/utility';

/**
 * Timer measurement
 * @see {@link https://stackoverflow.com/a/69985194/6404439}
 */
export default class MeasureTime {
  private startTime = 0;
  private endTime = 0;
  run(fn: any) {
    this.start();
    if (typeof fn == 'function') fn();
    console.log(this.end());
  }
  /**
   * measure time execution
   * @see {@link https://stackoverflow.com/a/70004960/6404439}
   * @param func
   * @param args
   */
  measure(func: any, ...args: any[]) {
    const displayName = func.name || varToString({ func });
    console.time(displayName);
    //const tupleArgs = [...args];
    //func(tupleArgs);
    func.apply(null, ...args);
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
