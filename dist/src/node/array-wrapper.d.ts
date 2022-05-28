/** @template T */
export declare class ArrayWrapper<T> extends Array<T> {
    each(callbackfn: (value: any, index: number, array: any[]) => void): void;
    /**
     * Remove an item from the list and return the removed item
     * @param item
     * @return
     */
    remove(item: any): any;
}
export interface XArray<T> extends Array<T> {
    [key: string]: any;
    each?: (item: any, index: number) => any;
}
export declare function array_wrap<T extends XArray<any>>(arr: T): XArray<T[number]> | T;
export declare const array_wrapper: typeof array_wrap;
