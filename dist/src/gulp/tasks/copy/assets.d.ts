/**
 * copy src-post assets to source/_posts
 * @returns
 */
export declare const copyAssets: (customPaths?: string | string[]) => import("bluebird")<{
    src: string;
    dest: string;
}[]>;
/**
 * @see {@link copyAssets}
 */
export declare const copy_assets: (customPaths?: string | string[]) => import("bluebird")<{
    src: string;
    dest: string;
}[]>;
