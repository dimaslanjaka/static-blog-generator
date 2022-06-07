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
  async run<T, U extends any[]>(msg: string = null, fn: T, ...args: U) {
    const isFunc = typeof fn == 'function';
    console.log(`---measure start---`);

    if (isFunc) {
      this.start();
      await fn.apply(null, ...args);
      console.log(color.greenBright(msg), this.end());
    }

    console.log(`---measure end---`);
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
