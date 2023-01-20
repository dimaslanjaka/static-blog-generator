/**
 * pick random items from array
 * @param items
 * @returns
 */
export declare function array_random<T extends any[]>(items: T): T[number];
/**
 * unique array
 * * array of string,number
 * * array of object by object key
 * @param arr
 * @param field key name (for array of object)
 * @returns
 *
 * @example
 * arrayOfObjUniq({p:'x',n:'x'},{p:'23',n:'x'},{p:'x',n:'5g'}, 'p'); // [{p:'x',n:'x'},{p:'23',n:'x'}]
 *
 * @link https://stackoverflow.com/a/67322087/6404439
 */
export declare function array_unique<T extends any[]>(arr: T, field?: string): T;
/**
 * Remove empties from array
 * @param arr
 * @returns
 */
export declare function array_remove_empty<T extends any[]>(arr: T): any[];
