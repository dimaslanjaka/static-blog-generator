/**
 * remove inline style html string
 * @param str
 * @param single_element true=single html (div, etc), false=full <html></html>
 * @returns
 */
export declare function removeInlineStyle(str: string, single_element?: boolean): string;
/**
 * remove all blogger inline style html from posts
 * @returns
 */
export declare function gulpInlineStyle(): Promise<{
    path: string;
    parsed: import("../../../hexo-post-parser/src/parsePost").postMap;
}[]>;
