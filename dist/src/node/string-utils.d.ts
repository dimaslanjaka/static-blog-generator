/**
 * clean white spaces
 * @param text
 * @returns
 */
export declare function cleanWhiteSpace(text: string): string;
/**
 * easy regex match
 * @param str
 * @param pattern
 * @returns
 */
export declare function strMatch(str: string, pattern: RegExp | string): boolean;
/**
 * @see {@link strMatch}
 */
export declare const isMatch: typeof strMatch;
/**
 * clean string with exception char
 * @param text
 * @returns
 */
export declare function cleanString(text: string, exception?: string): string;
/**
 * count words boundary
 * @param str
 * @returns
 */
export declare function countWords(str: string): number;
/**
 * Replace string by array pattern
 * @param array
 * @param replacement
 * @example
 * replaceArr('str', ['s','r'], ''); // t
 * replaceArr('str', ['s','r'], ['a s', 'ring']); // a string
 */
export declare function replaceArr(str: string, array: (string | RegExp)[], replacement: string | string[]): string;
export interface String {
    /**
     * Replace all instances of a substring in a string, using a regular expression or search string.
     * @param searchValue A string to search for.
     * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
     */
    replaceAll(searchValue: string | RegExp, replaceValue: string): string;
    /**
     * Replace all instances of a substring in a string, using a regular expression or search string.
     * @param searchValue A string to search for.
     * @param replacer A function that returns the replacement text.
     */
    replaceAll(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
}
/**
 * is variable an empty string ?
 * @param str
 * @returns
 */
export declare function isEmptyStr(str: any): boolean;
