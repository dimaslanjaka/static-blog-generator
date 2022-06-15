/**
 * remove empties from array
 * @param array
 * @param keep keep item such as `[null, 0, '']`
 * @returns
 * @see {@link https://www.typescriptlang.org/play?downlevelIteration=true&target=3&jsx=0&module=1#code/MYewdgzgLgBAhgJwXAnjAvDA2gRgDQwBMBAzAQK5gAmApgGYCWYNVBADAWOQDbcEBE-AVSr8AugG4AsAChQkENxoA6YEsQAKAJTS54CIpXcQAcw38A1jRoAHeLwBc-HbPkGly42YQ0AtiAA3GgBRXxsoBhoIDURkFAIsLl52AXEtFz0FDy9zK1sYAC8aBBAYDTYtJwy3Q09TDR9-INDwyOjY1AS2MXTdGuz6y2s7JO4qvv1anMbAkLCIqJikTuxRnurJgbMh-L9wtGgEJhNx102jepnm+baluITBdYmsi+2qcFg8uzgwFCgAC2Op0y7leDT8sxaC3ayxQvVksgA9AAqZGyGDImBXGgwPbQmB0Eq+eCw9GYgACNkQcGJHRQZJglOpxK+MFZDCgfhgEHIwH+8Agqx4fBgHBgAHJxWIGeSfFByAhIDKaAAPGk2JRksmI2R0SjACLgLEQ66tKIAHgAKriVZzqIKfigsGIAHwadEkuIOGCWvAer7ejSjGAAHxgXF8ACNiqHuVAjmATFpnRhsNKZFoYABvD1KWDMADuAEFYam6cpGNxOQgNBoOX5M+gXTAoCgbDQQHQYPXiQBCdCYfiUWiMZiiDIwGBuT7DQWYL7KXxwGy1nuN5sAZXjxzrnN88Jkk4YXY0va+EGUTDU5Fo0X4o2cWg9k8LJbiqdfsIrDCrxVXe-Xbs9xgftMFGCcYERRF+jBcUoBwcVOBoYtYQg48yjPWdLzAa9b3MNhH2zZ9w2Qt9UA-Uiv0rat-wbDBmxzQ9J2Y9CNFbdtOyArkBxge9yCjYpnGNeVFS4vseLYXRmOYuUFTAFsEHIGgpOYgBfCDVI9KCYLqMw4MIRCSJQuI0JPTDbAvK9uBvRZBHSIimJfSj3zA5zUG-X8a13Oimwc6SjxPdiOy7HsMEHQ5jiE2TRJ7ZRt18bRPBoRMARgZtJOIydovk+MlJUyd1JUzSmOyoyyLQOBBUtXRiqAA}
 * @example
 */
export declare function removeEmpties<T extends any[]>(array: T, keep?: (null | number | string)[]): T;
/**
 * get item from last index array
 * @param arr
 * @param lastIndex index from last
 * @see {@link https://www.typescriptlang.org/play?downlevelIteration=true&target=3&jsx=0&module=1#code/MYewdgzgLgBAhgJwXAnjAvDA2gRgDQwBMBAzAQK5gAmApgGYCWYNVBADAWOQDbcEBE-AVSr8AugG4AsAChQkENxoA6YEsQAKAJTS54CIpXcQAcw0maUADJxoASSg0AthsTIUpLTtmyA9ACp-WRh-GAtYBkcnGDoEEGjuWwjqGgAPeCRUYNCAAQAHRDhot2yYfMKEpLsU9KZadNj4mEToUpyES3IESGzfWTS8kARYOkpgKAZwMMsbeyiAHgAVGDTHagh4MBQsMQA+VyQALhhFghaoavqMGBwtGABvYJgOqC6wDIQsN2UlMBMoAAWMAAtM0qjVJLIAL6yIA}
 * @returns
 */
export declare function getLastItem<T extends any[]>(arr: T, lastIndex?: number): any;
/**
 * Unique string array case insensitive but keep one case sensitive result
 * @see {@link https://stackoverflow.com/a/48731445/6404439}
 * @example
 * console.log(uniqueStringArray(['James', 'james', 'bob', 'JaMeS', 'Bob'])); // ["JaMeS", "Bob"]
 */
export declare const uniqueStringArray: (arr: Array<string>) => string[];
/**
 * @summary Add another array
 * @description Add another array to current array
 * @param self
 * @param otherArrays
 * @example
 * var a = [0,1];
 * var b = ['a','b'];
 * arrayAddAll(b, a); // concat a to b
 * console.log(b); // ['a','b',0,1]
 */
export declare const arrayAddAll: <T extends any[]>(self: T, ...otherArrays: T[]) => T;
/**
 * Array unique
 * @param {Array<any>} arrays
 */
export declare function array_unique(arrays: any[]): any[];
/**
 * pick random from array
 * @param {Array<any>} arrays
 * @param {boolean} unique Unique the arrays
 */
export declare function array_rand(arrays: any[], unique: any): {
    index: number;
    value: any;
};
/**
 * PHP shuffle array equivalent
 * @param array
 * @example
 * var arr = [2, 11, 37, 42];
 * shuffle(arr);
 * console.log(arr); //return random
 */
export declare function shuffle(array: Array<any>): any[];
/**
 * @see {@link shuffle}
 */
export declare const array_shuffle: typeof shuffle;
/**
 * Move item to another index
 * @see {@link https://stackoverflow.com/a/70618791/6404439}
 * @param arr
 * @param from
 * @param to
 * @returns
 */
export declare const array_move: <T extends any[]>(arr: T, from: number, to: number) => T;
/**
 * @see {@link array_move}
 */
export declare const array_move_index: <T extends any[]>(arr: T, from: number, to: number) => T;
/**
 * split array to chunks
 * @param sourceArray
 * @param chunkSize
 * @see {@link https://stackoverflow.com/a/71483760/6404439}
 * @returns
 * @example
let ar1 = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
];
// split array by 4
console.log("Split in chunks with 4 size", splitChunks(ar1, 4)); // [[1,2,3,4], [5,6,7,8]...]
 */
export declare function array_split_chunks<T extends any[]>(sourceArray: T, chunkSize: number): T[];
