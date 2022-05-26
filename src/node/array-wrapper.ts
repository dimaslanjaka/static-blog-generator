/** @template T */
export class ArrayWrapper<T> extends Array<T> {
  each(callbackfn: (value: any, index: number, array: any[]) => void) {
    return this.forEach(callbackfn);
  }
  /**
   * Remove an item from the list and return the removed item
   * @param item
   * @return
   */
  remove(item: any) {
    const index = this.indexOf(item);
    if (index === -1) {
      throw new Error(`${item} not in list`);
    }
    this.splice(index, 1);
    return item;
  }
}

export interface XArray extends Array<any> {
  [key: string]: any;
  each?: (item: any, index: number) => any;
}
export function array_wrap<T extends Partial<XArray>>(arr: T): Partial<XArray> {
  const newArr = arr;
  newArr.each = arr.forEach;
  //const init = new ArrayWrapper<T[number]>(...arr);
  //init['each'] = init.forEach;
  return newArr;
}
export const array_wrapper = array_wrap;
