/**
 * clean white spaces
 * @param s
 * @returns
 */
export declare function cleanWhiteSpace(text: string): string;
/**
 * clean string with exception char
 * @param text
 * @returns
 */
export declare function cleanString(text: string, exception?: string): string;
/**
 * Replace string by array pattern
 * @param array
 * @param replacement
 * @example
 * replaceArr('str', ['s','r'], ''); // t
 * replaceArr('str', ['s','r'], ['a s', 'ring']); // a string
 */
export declare function replaceArr(str: string, array: (string | RegExp)[], replacement: string | string[]): string;
