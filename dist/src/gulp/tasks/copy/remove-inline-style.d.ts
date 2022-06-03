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
<<<<<<< HEAD
    parsed: import("hexo-post-parser/dist/parsePost").postMap;
=======
    parsed: postMap;
>>>>>>> 814a46dc2692246119681cb224bc79918060304f
}[]>;
